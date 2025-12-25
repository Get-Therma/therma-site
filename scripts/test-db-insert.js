#!/usr/bin/env node

/**
 * Test Database Insert
 * Tests if database inserts are actually working
 */

require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

async function testDbInsert() {
  console.log('🧪 Testing Database Insert\n');

  const connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres';
  
  // Use connection pooler
  let finalConnectionString = connectionString;
  if (finalConnectionString.includes(':5432/')) {
    finalConnectionString = finalConnectionString.replace(':5432/', ':6543/');
    if (!finalConnectionString.includes('?')) {
      finalConnectionString += '?pgbouncer=true';
    } else if (!finalConnectionString.includes('pgbouncer')) {
      finalConnectionString += '&pgbouncer=true';
    }
  }

  const testEmail = `test-${Date.now()}@example.com`;
  console.log(`📧 Test email: ${testEmail}\n`);

  const pool = new Pool({
    connectionString: finalConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  
  try {
    console.log('1️⃣ Connecting to database...');
    await client.query('SELECT 1');
    console.log('   ✅ Database connection successful\n');

    console.log('2️⃣ Attempting to insert email...');
    try {
      const insertResult = await client.query(
        `INSERT INTO waitlist (email, attribution, created_at) 
         VALUES ($1, $2, NOW()) 
         RETURNING *`,
        [
          testEmail,
          JSON.stringify({
            source: 'Test Script',
            timestamp: new Date().toISOString()
          })
        ]
      );
      
      console.log('   ✅ Insert successful!');
      console.log('   Inserted record:', JSON.stringify(insertResult.rows[0], null, 2));
      console.log('');

      console.log('3️⃣ Verifying insert by querying...');
      const queryResult = await client.query(
        'SELECT * FROM waitlist WHERE email = $1',
        [testEmail]
      );
      
      if (queryResult.rows.length > 0) {
        console.log('   ✅ Email found in database!');
        console.log('   Record:', JSON.stringify(queryResult.rows[0], null, 2));
      } else {
        console.log('   ❌ Email NOT found in database after insert!');
        console.log('   This suggests the insert was rolled back or failed silently.');
      }

      console.log('\n4️⃣ Checking total emails in database...');
      const countResult = await client.query('SELECT COUNT(*) FROM waitlist');
      console.log(`   Total emails in database: ${countResult.rows[0].count}`);

    } catch (insertError) {
      console.error('   ❌ Insert failed!');
      console.error('   Error:', insertError.message);
      console.error('   Error code:', insertError.code);
      console.error('   Full error:', JSON.stringify(insertError, Object.getOwnPropertyNames(insertError), 2));
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
    console.error('\n💡 Check:');
    console.error('   1. POSTGRES_URL in .env.local is correct');
    console.error('   2. Database is accessible');
    console.error('   3. Network connection is working');
  } finally {
    client.release();
    await pool.end();
  }
}

testDbInsert().catch(console.error);

