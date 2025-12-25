import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ThankYouEmailTemplate } from '../../../lib/email-templates';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';
import { eq } from 'drizzle-orm';
import { getDomainFromRequest, DOMAIN_CONFIGS } from '../../../lib/domain-config';
import { sendOptimizedEmail } from '../../../lib/email-performance';

export async function POST(req: Request) {
  try {
    const { email, source, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Normalize email (lowercase and trim) for consistent duplicate detection
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Original email:', email);
    console.log('📧 Normalized email:', normalizedEmail);

    // Get domain configuration based on request
    const domainConfig = getDomainFromRequest(req);
    
    console.log('Processing subscription for:', normalizedEmail);
    console.log('Domain config:', domainConfig.domain);
    console.log('From email:', domainConfig.fromEmail);
    console.log('Beehiiv API Key exists:', !!process.env.BEEHIIV_API_KEY);
    console.log('Publication ID exists:', !!process.env.BEEHIIV_PUBLICATION_ID);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);

    // CHECK FOR DUPLICATES FIRST (before attempting any inserts)
    let isDuplicate = false;
    let beehiivDuplicate = false;
    
    try {
      const db = await getDb();
      console.log('🔍 Checking database for duplicate email:', normalizedEmail);
      
      // Use a more explicit query to ensure it works
      // Check for exact match (case-sensitive since we normalize)
      const existingEmail = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, normalizedEmail))
        .limit(1);
      
      console.log('📊 Database query result:', existingEmail.length, 'existing records found');
      
      if (existingEmail.length > 0) {
        console.log('🚫 DUPLICATE FOUND in database!');
        console.log('   Email:', normalizedEmail);
        console.log('   Existing record ID:', existingEmail[0].id);
        console.log('   Existing record:', JSON.stringify(existingEmail[0], null, 2));
        isDuplicate = true;
      } else {
        console.log('✅ Email not found in database (new email):', normalizedEmail);
      }
    } catch (dbError: any) {
      console.error('❌ Error checking for duplicate in database:', dbError);
      console.error('Error details:', {
        message: dbError?.message,
        code: dbError?.code,
        stack: dbError?.stack,
        name: dbError?.name
      });
      // If database is completely unavailable, we should still try to prevent duplicates
      // by checking Beehiv and catching on insert
      // But log this as a warning
      console.warn('⚠️ Database duplicate check failed - will rely on insert constraint and Beehiv check');
    }

    // If duplicate found in database, skip Beehiv and return early
    if (isDuplicate) {
      console.log('🚫 DUPLICATE DETECTED in database - Returning 409 Conflict');
      console.log('   Skipping Beehiv and email sending');
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate: false,
        databaseDuplicate: true,
        beehiivSuccess: false,
        emailSuccess: false,
        dbSuccess: true
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    // Try to subscribe to Beehiiv (optional - don't fail if it doesn't work)
    let beehiivSuccess = false;
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      // Retry mechanism for Beehiv
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Beehiiv attempt ${attempt}/2 for email: ${normalizedEmail}`);
          const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
            },
            body: JSON.stringify({
              email: normalizedEmail,
              reactivate_existing: false, // Set to false to reject duplicates instead of reactivating
              double_opt_in: true,
              source: source ?? 'Website',
              utm_source,
              utm_medium,
              utm_campaign
            }),
            cache: 'no-store'
          });

          console.log('Beehiiv response status:', res.status);
          console.log('Beehiiv response headers:', Object.fromEntries(res.headers.entries()));
          
          if (res.ok) {
            const data = await res.json();
            console.log('Beehiiv success response:', JSON.stringify(data, null, 2));
            
            // Check if this was a reactivation (existing subscriber)
            // Beehiv returns status: "active" for new, "reactivated" for existing, "invalid" for duplicates
            // Also check for any indication this is a duplicate
            const status = data?.data?.status || data?.status;
            const subscriptionId = data?.data?.id || data?.id;
            const created = data?.data?.created || data?.created;
            const responseStr = JSON.stringify(data).toLowerCase();
            
            // Check for duplicate indicators in the response
            // Beehiiv may return status "invalid" for duplicates, or "reactivated" for existing
            // Also check if created timestamp is old (suggests existing subscription)
            const now = Math.floor(Date.now() / 1000);
            const isOldSubscription = created && (now - created) > 60; // Created more than 60 seconds ago
            
            const indicatesDuplicate = 
              status === 'reactivated' ||
              status === 'invalid' || // Invalid status indicates duplicate
              isOldSubscription || // Old created timestamp suggests existing subscription
              responseStr.includes('already exists') ||
              responseStr.includes('already subscribed') ||
              responseStr.includes('duplicate') ||
              responseStr.includes('existing');
            
            // CRITICAL: Check database again AFTER Beehiiv call but BEFORE insert
            // This catches race conditions where email was added between our initial check and now
            if (!indicatesDuplicate) {
              try {
                const db = await getDb();
                const existingSub = await db
                  .select()
                  .from(waitlist)
                  .where(eq(waitlist.email, normalizedEmail))
                  .limit(1);
                
                if (existingSub.length > 0) {
                  console.log('🚫 DUPLICATE DETECTED: Email exists in database (race condition check)');
                  console.log('Existing record:', JSON.stringify(existingSub[0], null, 2));
                  beehiivDuplicate = true;
                  beehiivSuccess = true; // Consider handled
                  isDuplicate = true; // Also mark as database duplicate
                }
              } catch (dbCheckError) {
                console.warn('Database check after Beehiiv failed:', dbCheckError);
                // Continue - we'll catch it on insert
              }
            }
            
            if (indicatesDuplicate) {
              console.log('🚫 DUPLICATE DETECTED in Beehiiv (success response indicates duplicate)');
              console.log('Status:', status);
              console.log('Subscription ID:', subscriptionId);
              console.log('Created timestamp:', created, isOldSubscription ? '(OLD - indicates existing)' : '(NEW)');
              console.log('Full response:', JSON.stringify(data, null, 2));
              beehiivDuplicate = true;
              beehiivSuccess = true; // Consider this handled
            } else {
              beehiivSuccess = true;
            }
          } else {
            const errorText = await res.text();
            console.log('Beehiiv error response:', errorText);
            console.log('Beehiiv error status:', res.status);
            
            // Check if it's a duplicate error (common Beehiv response)
            // With reactivate_existing: false, Beehiiv may return 400, 409, or 422 for duplicates
            const lowerErrorText = errorText.toLowerCase();
            const isDuplicateError = 
              (res.status === 400 || res.status === 409 || res.status === 422) && (
                lowerErrorText.includes('already exists') || 
                lowerErrorText.includes('already subscribed') || 
                lowerErrorText.includes('duplicate') ||
                lowerErrorText.includes('subscription already') ||
                lowerErrorText.includes('email already') ||
                lowerErrorText.includes('already in') ||
                lowerErrorText.includes('already registered') ||
                lowerErrorText.includes('is already') ||
                lowerErrorText.includes('has already')
              );
            
            if (isDuplicateError) {
              console.log('🚫 DUPLICATE DETECTED in Beehiiv (error response)');
              console.log('Status:', res.status);
              console.log('Error text:', errorText);
              beehiivSuccess = true; // Consider this handled
              beehiivDuplicate = true; // Mark as duplicate
            } else {
              // Log detailed error for debugging
              console.error('Beehiiv subscription failed:', {
                status: res.status,
                statusText: res.statusText,
                errorText,
                email: normalizedEmail,
                publicationId: process.env.BEEHIIV_PUBLICATION_ID
              });
            }
          }
          
          // If successful or duplicate, break out of retry loop
          if (beehiivSuccess) {
            break;
          }
          
          // If this is the first attempt and failed, wait before retry
          if (attempt === 1) {
            console.log('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (beehiivError) {
          console.error(`Beehiiv API error (attempt ${attempt}):`, beehiivError);
          // If this is the first attempt, wait before retry
          if (attempt === 1) {
            console.log('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } else {
      console.log('Beehiiv not configured, skipping');
    }

    // If Beehiv detected duplicate, return early
    if (beehiivDuplicate) {
      console.log('🚫 DUPLICATE DETECTED in Beehiv - Returning 409 Conflict');
      console.log('   Skipping email sending and database insert');
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate: true,
        databaseDuplicate: isDuplicate,
        beehiivSuccess: true,
        emailSuccess: false,
        dbSuccess: false
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    // Send thank you email ONLY if Beehiv successfully accepted the subscription
    let emailSuccess = false;
    let emailResult: any = null;
    
    if (process.env.RESEND_API_KEY && beehiivSuccess) {
      try {
        console.log('Sending optimized welcome email...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Use performance-optimized email sending with React component
        const emailTemplate = ThankYouEmailTemplate({ email: normalizedEmail });
        emailResult = await sendOptimizedEmail(
          resend,
          normalizedEmail,
          'Welcome to Therma! 🎉',
          emailTemplate,
          domainConfig.domain // Prefer the domain the user visited
        );
        
        if (emailResult.success) {
          console.log(`Email sent successfully from ${emailResult.domain} in ${emailResult.duration}ms`);
          console.log(`Email ID: ${emailResult.emailId}`);
          emailSuccess = true;
        } else {
          console.error('Failed to send email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    } else if (!beehiivSuccess) {
      console.log('Skipping welcome email - Beehiv rejected the subscription');
    } else {
      console.log('No Resend API key found, cannot send email');
    }

    // Store in Supabase database (only if not already a duplicate)
    let dbSuccess = false;
    
    // Skip database insert if we've already detected a duplicate
    if (isDuplicate || beehiivDuplicate) {
      console.log('⏭️ Skipping database insert - duplicate already detected');
      dbSuccess = true; // Consider handled
    } else {
      try {
        const db = await getDb();
        
        // Try to insert - if it fails due to unique constraint, catch it
        try {
          console.log('Attempting to insert email into database:', normalizedEmail);
          await db.insert(waitlist).values({
            email: normalizedEmail,
            attribution: JSON.stringify({
              source: source ?? 'Website',
              utm_source,
              utm_medium,
              utm_campaign,
              timestamp: new Date().toISOString(),
              beehiivSuccess,
              emailSuccess
            })
          });
          console.log('✅ Email stored in Supabase database successfully');
          dbSuccess = true;
        } catch (insertError: any) {
          // Log full error for debugging
          console.log('Insert error caught - Full error object:', JSON.stringify(insertError, Object.getOwnPropertyNames(insertError), 2));
          console.log('Insert error details:', {
            code: insertError?.code,
            message: insertError?.message,
            constraint: insertError?.constraint,
            detail: insertError?.detail,
            errno: insertError?.errno,
            sqlState: insertError?.sqlState,
            name: insertError?.name
          });
          
          // Check if it's a unique constraint violation (duplicate)
          // PostgreSQL error code 23505 = unique_violation
          // Also check for various error message patterns
          const errorMessage = String(insertError?.message || '').toLowerCase();
          const errorCode = String(insertError?.code || '');
          const errorDetail = String(insertError?.detail || '').toLowerCase();
          
          const isUniqueViolation = 
            errorCode === '23505' || // PostgreSQL unique_violation
            errorCode === '23503' || // Foreign key violation (shouldn't happen but check anyway)
            errorMessage.includes('unique') || 
            errorMessage.includes('duplicate') ||
            errorMessage.includes('already exists') ||
            errorMessage.includes('violates unique constraint') ||
            errorDetail.includes('unique') ||
            errorDetail.includes('duplicate') ||
            insertError?.constraint?.includes('email') ||
            insertError?.constraint?.includes('waitlist');
            
          if (isUniqueViolation) {
            console.log('🚫 DUPLICATE DETECTED via INSERT constraint violation');
            console.log('✅ Email already exists in database (unique constraint violation):', normalizedEmail);
            console.log('   Error code:', errorCode);
            console.log('   Error message:', insertError?.message);
            console.log('   Error detail:', insertError?.detail);
            return NextResponse.json({
              error: 'Email already exists',
              message: 'This email address is already subscribed to our waitlist.',
              duplicate: true,
              beehiivDuplicate,
              databaseDuplicate: true,
              beehiivSuccess,
              emailSuccess,
              dbSuccess: false
            }, { status: 409 });
          } else {
            console.error('❌ Database insert failed with non-duplicate error');
            console.error('Error type:', typeof insertError);
            console.error('Error keys:', Object.keys(insertError || {}));
            throw insertError; // Re-throw if it's a different error
          }
        }
      } catch (dbError: any) {
        console.error('❌ FAILED to store email in database');
        console.error('Database error type:', typeof dbError);
        console.error('Database error:', dbError);
        console.error('Error message:', dbError?.message);
        console.error('Error code:', dbError?.code);
        console.error('Error detail:', dbError?.detail);
        console.error('Error constraint:', dbError?.constraint);
        console.error('Full error keys:', Object.keys(dbError || {}));
        console.error('Full error object:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError), 2));
        
        // Check if this is a unique constraint violation that wasn't caught
        const errorMessage = String(dbError?.message || '').toLowerCase();
        const errorCode = String(dbError?.code || '');
        const errorDetail = String(dbError?.detail || '');
        const errorString = JSON.stringify(dbError).toLowerCase();
        
        const isUniqueViolation = 
          errorCode === '23505' || // PostgreSQL unique_violation
          errorCode === '23503' || // Foreign key violation
          errorMessage.includes('unique') || 
          errorMessage.includes('duplicate') ||
          errorMessage.includes('already exists') ||
          errorMessage.includes('violates unique constraint') ||
          errorDetail.includes('unique') ||
          errorDetail.includes('duplicate') ||
          errorString.includes('unique') ||
          errorString.includes('duplicate') ||
          dbError?.constraint?.includes('email') ||
          dbError?.constraint?.includes('waitlist');
        
        if (isUniqueViolation) {
          console.log('🚫 DUPLICATE DETECTED in outer catch block (unique constraint violation)');
          console.log('   Error code:', errorCode);
          console.log('   Error message:', dbError?.message);
          console.log('   Error detail:', dbError?.detail);
          return NextResponse.json({
            error: 'Email already exists',
            message: 'This email address is already subscribed to our waitlist.',
            duplicate: true,
            beehiivDuplicate,
            databaseDuplicate: true,
            beehiivSuccess,
            emailSuccess,
            dbSuccess: false
          }, { status: 409 });
        } else {
          console.error('Error stack:', dbError?.stack);
          dbSuccess = false;
          console.warn('⚠️ Database error is NOT a duplicate - continuing without database storage');
        }
      }
    }

    // Final duplicate check - if duplicate found anywhere, return 409
    // This MUST happen before returning success
    if (isDuplicate || beehiivDuplicate) {
      console.log('🚫 DUPLICATE DETECTED - Returning 409 Conflict');
      console.log('   Database duplicate:', isDuplicate);
      console.log('   Beehiv duplicate:', beehiivDuplicate);
      
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate,
        databaseDuplicate: isDuplicate,
        beehiivSuccess,
        emailSuccess,
        dbSuccess
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    console.log('✅ No duplicates found - subscription successful');

    // If database insert failed and it wasn't a duplicate, that's a problem
    if (!dbSuccess && !isDuplicate) {
      console.warn('⚠️ Database insert failed but not a duplicate - this is unexpected');
    }

    // If all services failed, return an error
    if (!beehiivSuccess && !emailSuccess && !dbSuccess) {
      return NextResponse.json({ 
        error: 'All services failed',
        beehiivSuccess,
        emailSuccess,
        dbSuccess
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      beehiivSuccess,
      emailSuccess,
      dbSuccess,
      domain: emailResult?.domain || domainConfig.domain,
      fromEmail: emailResult?.fromEmail || domainConfig.fromEmail,
      emailDuration: emailResult?.duration || 0,
      message: beehiivSuccess 
        ? (emailSuccess ? 'Welcome email sent successfully!' : 'Subscription accepted but email service unavailable')
        : 'Subscription not accepted by Beehiv (email may be invalid or already exists)'
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
