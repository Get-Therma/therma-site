#!/usr/bin/env node

/**
 * Test Database Duplicate Detection
 * Directly tests the database to see if duplicate detection works
 */

require('dotenv').config({ path: '.env.local' });

const { getDb } = require('../lib/db');
const { waitlist } = require('../lib/schema');
const { eq } = require('drizzle-orm');

async function testDbDuplicate() {
  console.log('🧪 Testing Database Duplicate Detection\n');

  const testEmail = (process.argv[2] || 'test-duplicate@example.com').toLowerCase().trim();
  
  console.log(`📧 Test email: ${testEmail}\n`);

  try {
    const db = await getDb();
    
    // Check if email exists
    console.log('1️⃣ Checking if email exists in database...');
    const existing = await db.select().from(waitlist).where(eq(waitlist.email, testEmail)).limit(1);
    
    if (existing.length > 0) {
      console.log('   ✅ Email found in database (duplicate)');
      console.log('   Record:', JSON.stringify(existing[0], null, 2));
    } else {
      console.log('   ✅ Email not found (new email)');
    }
    
    // Try to insert
    console.log('\n2️⃣ Attempting to insert email...');
    try {
      await db.insert(waitlist).values({
        email: testEmail,
        attribution: JSON.stringify({
          source: 'test',
          timestamp: new Date().toISOString()
        })
      });
      console.log('   ✅ Insert successful (new email)');
    } catch (insertError) {
      console.log('   ❌ Insert failed');
      console.log('   Error code:', insertError?.code);
      console.log('   Error message:', insertError?.message);
      
      if (insertError?.code === '23505' || insertError?.message?.includes('unique')) {
        console.log('   ✅ This is a duplicate (unique constraint violation)');
      } else {
        console.log('   ❌ This is a different error');
      }
    }
    
    // Check again
    console.log('\n3️⃣ Checking again after insert attempt...');
    const existingAfter = await db.select().from(waitlist).where(eq(waitlist.email, testEmail)).limit(1);
    console.log('   Found', existingAfter.length, 'record(s)');
    
  } catch (error) {
    console.error('❌ Database error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    });
  }

  console.log('\n📊 Test complete');
  process.exit(0);
}

testDbDuplicate().catch(console.error);




