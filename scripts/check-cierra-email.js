// scripts/check-cierra-email.js
require('dotenv').config({ path: '.env.local' });

async function checkCierraEmail() {
  console.log('🔍 Checking Cierra Email Submission\n');

  const email = 'cierraarasile@gmail.com';
  console.log(`📧 Checking email: ${email}\n`);

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.error('❌ Beehiv API key or Publication ID not found');
    return;
  }

  try {
    // Check if email exists in Beehiv
    console.log('🔍 Checking Beehiv for this email...');
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Beehiv Response Status:', beehiivResponse.status);
    
    if (beehiivResponse.ok) {
      const beehiivData = await beehiivResponse.json();
      if (beehiivData.data && beehiivData.data.length > 0) {
        const subscriber = beehiivData.data[0];
        console.log('✅ Found in Beehiv:');
        console.log('   Email:', subscriber.email);
        console.log('   Status:', subscriber.status);
        console.log('   Created:', new Date(subscriber.created * 1000).toISOString());
        console.log('   Source:', subscriber.source || 'Unknown');
        console.log('   ID:', subscriber.id);
        console.log('   Subscription Tier:', subscriber.subscription_tier);
        console.log('   UTM Source:', subscriber.utm_source || 'None');
        console.log('   UTM Medium:', subscriber.utm_medium || 'None');
        console.log('   UTM Campaign:', subscriber.utm_campaign || 'None');
      } else {
        console.log('❌ NOT FOUND in Beehiv');
        console.log('   This email was not recorded in Beehiv');
      }
    } else {
      const errorText = await beehiivResponse.text();
      console.log('❌ Error checking Beehiv:', errorText);
    }
    console.log('');

    // Test creating this email in Beehiv
    console.log('🧪 Testing Beehiv creation for this email...');
    const createResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Manual Check - Cierra'
      })
    });

    console.log('📊 Create Response Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Successfully created in Beehiv:');
      console.log('   Email:', createData.data?.email);
      console.log('   Status:', createData.data?.status);
      console.log('   ID:', createData.data?.id);
      console.log('   Created:', new Date(createData.data?.created * 1000).toISOString());
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Error creating in Beehiv:', errorText);
    }
    console.log('');

    // Test Resend email
    console.log('📧 Testing Resend email...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const resendResult = await resend.emails.send({
        from: 'Therma <hello@therma.one>',
        to: [email],
        subject: 'Welcome to Therma — your spot is saved',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366F1; margin-bottom: 10px;">Welcome to Therma!</h1>
              <p style="color: #666; font-size: 18px;">Thank you for joining our waitlist</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">What's Next?</h2>
              <p>We're excited to have you on board! Here's what you can expect:</p>
              <ul style="color: #555;">
                <li>Early access to our beta when it launches</li>
                <li>Exclusive updates about Therma's development</li>
                <li>Special pricing for early supporters</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                Questions? Reply to this email or visit our <a href="https://therma.one/faq" style="color: #6366F1;">FAQ page</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This email was sent to ${email} because you joined our waitlist.
              </p>
            </div>
          </div>
        `
      });
      
      if (resendResult.data?.id) {
        console.log('✅ Resend email sent successfully:');
        console.log('   Email ID:', resendResult.data.id);
        console.log('   Check inbox for:', email);
        console.log('   Subject: Welcome to Therma — your spot is saved');
      } else {
        console.log('❌ Resend email failed:', resendResult.error);
      }
    } catch (resendError) {
      console.log('❌ Resend error:', resendError.message);
    }
    console.log('');

    // Test API endpoint
    console.log('🌐 Testing API endpoint...');
    const apiResponse = await fetch('http://localhost:3001/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        source: 'Cierra Email Test',
        utm_source: 'manual-check',
        utm_medium: 'script',
        utm_campaign: 'cierra-verification'
      })
    });

    const apiResult = await apiResponse.json();
    console.log('📊 API Response:');
    console.log('   Status:', apiResponse.status);
    console.log('   Beehiv Success:', apiResult.beehiivSuccess);
    console.log('   Email Success:', apiResult.emailSuccess);
    console.log('   Domain:', apiResult.domain);
    console.log('   From Email:', apiResult.fromEmail);
    console.log('   Email Duration:', apiResult.emailDuration);
    console.log('   Message:', apiResult.message);

    console.log('\n📋 Summary for Cierra:');
    console.log('   • Check Beehiv dashboard for this email');
    console.log('   • Check inbox/spam folder for welcome email');
    console.log('   • If not found, the submission may have failed');
    console.log('   • Real Gmail addresses should work perfectly');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run check
checkCierraEmail().catch(console.error);
