#!/usr/bin/env node

/**
 * Test Full Integration: Supabase + Beehiiv
 * Tests if emails are being stored in both services
 */

require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

const testEmail = process.argv[2] || `test-${Date.now()}@example.com`;

async function testFullIntegration() {
  console.log('🧪 Testing Full Integration: Supabase + Beehiiv\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  // Test 1: Supabase Connection
  console.log('1️⃣ Testing Supabase Connection...');
  const connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres';
  
  let finalConnectionString = connectionString;
  if (finalConnectionString.includes(':5432/')) {
    finalConnectionString = finalConnectionString.replace(':5432/', ':6543/');
    if (!finalConnectionString.includes('?')) {
      finalConnectionString += '?pgbouncer=true';
    } else if (!finalConnectionString.includes('pgbouncer')) {
      finalConnectionString += '&pgbouncer=true';
    }
  }

  const pool = new Pool({
    connectionString: finalConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  let supabaseSuccess = false;
  let supabaseError = null;

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    console.log('   ✅ Supabase connection successful\n');
    client.release();
  } catch (error) {
    console.error('   ❌ Supabase connection failed:', error.message);
    supabaseError = error;
  }

  // Test 2: Beehiiv API
  console.log('2️⃣ Testing Beehiiv API...');
  let beehiivSuccess = false;
  let beehiivError = null;

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.log('   ⚠️  Beehiiv API key or Publication ID not set');
  } else {
    try {
      const response = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
        },
        body: JSON.stringify({
          email: testEmail,
          reactivate_existing: false,
          double_opt_in: true,
          source: 'Integration Test'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Beehiiv subscription successful');
        console.log('   Response:', JSON.stringify(data, null, 2));
        beehiivSuccess = true;
      } else {
        const errorText = await response.text();
        console.log('   ⚠️  Beehiiv returned error:', response.status);
        console.log('   Error:', errorText);
        if (response.status === 400 && errorText.toLowerCase().includes('already')) {
          console.log('   ℹ️  Email already exists in Beehiiv (this is expected for duplicates)');
          beehiivSuccess = true; // Consider this a success
        }
      }
    } catch (error) {
      console.error('   ❌ Beehiiv API error:', error.message);
      beehiivError = error;
    }
  }
  console.log('');

  // Test 3: Store in Supabase
  console.log('3️⃣ Testing Supabase Storage...');
  let supabaseInsertSuccess = false;

  if (!supabaseError) {
    try {
      const client = await pool.connect();
      
      // Check if email already exists
      const checkResult = await client.query(
        'SELECT * FROM waitlist WHERE email = $1',
        [testEmail]
      );

      if (checkResult.rows.length > 0) {
        console.log('   ℹ️  Email already exists in Supabase');
        console.log('   Existing record:', JSON.stringify(checkResult.rows[0], null, 2));
        supabaseInsertSuccess = true;
      } else {
        // Try to insert
        const insertResult = await client.query(
          `INSERT INTO waitlist (email, attribution, created_at) 
           VALUES ($1, $2, NOW()) 
           RETURNING *`,
          [
            testEmail,
            JSON.stringify({
              source: 'Integration Test',
              beehiivSuccess,
              timestamp: new Date().toISOString()
            })
          ]
        );
        
        console.log('   ✅ Email stored in Supabase successfully');
        console.log('   Record:', JSON.stringify(insertResult.rows[0], null, 2));
        supabaseInsertSuccess = true;
      }

      client.release();
    } catch (error) {
      console.error('   ❌ Supabase insert failed:', error.message);
      if (error.code === '23505') {
        console.log('   ℹ️  This is a duplicate (unique constraint violation)');
        supabaseInsertSuccess = true; // Consider this handled
      }
    }
  }
  console.log('');

  // Test 4: Verify in Supabase
  console.log('4️⃣ Verifying Email in Supabase...');
  if (!supabaseError) {
    try {
      const client = await pool.connect();
      const verifyResult = await client.query(
        'SELECT * FROM waitlist WHERE email = $1',
        [testEmail]
      );

      if (verifyResult.rows.length > 0) {
        console.log('   ✅ Email found in Supabase');
        console.log('   Record:', JSON.stringify(verifyResult.rows[0], null, 2));
      } else {
        console.log('   ❌ Email NOT found in Supabase');
      }

      // Get total count
      const countResult = await client.query('SELECT COUNT(*) FROM waitlist');
      console.log(`   Total emails in database: ${countResult.rows[0].count}`);

      client.release();
    } catch (error) {
      console.error('   ❌ Verification failed:', error.message);
    }
  }
  console.log('');

  // Summary
  console.log('📊 Test Summary:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Supabase Connection: ${supabaseError ? '❌ Failed' : '✅ Working'}`);
  console.log(`Supabase Storage:   ${supabaseInsertSuccess ? '✅ Working' : '❌ Failed'}`);
  console.log(`Beehiiv API:        ${beehiivSuccess ? '✅ Working' : '❌ Failed'}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (supabaseInsertSuccess && beehiivSuccess) {
    console.log('✅ SUCCESS: Both Supabase and Beehiiv are working!');
  } else if (supabaseInsertSuccess) {
    console.log('⚠️  PARTIAL: Supabase working, but Beehiiv failed');
  } else if (beehiivSuccess) {
    console.log('⚠️  PARTIAL: Beehiiv working, but Supabase failed');
  } else {
    console.log('❌ FAILED: Both services have issues');
  }

  await pool.end();
}

testFullIntegration().catch(console.error);

