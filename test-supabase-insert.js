const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function testInsert() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testing Supabase Insert...\n');
    
    // Test insert
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`Inserting test email: ${testEmail}`);
    
    await client.query(`
      INSERT INTO waitlist (email, attribution) 
      VALUES ($1, $2)
    `, [testEmail, JSON.stringify({ source: 'Manual Test', timestamp: new Date().toISOString() })]);
    
    console.log('✅ Insert successful!\n');
    
    // Query it back
    const result = await client.query('SELECT * FROM waitlist WHERE email = $1', [testEmail]);
    console.log('✅ Retrieved email:', result.rows[0]);
    
    // Count total
    const count = await client.query('SELECT COUNT(*) FROM waitlist');
    console.log('\n📊 Total emails in database:', count.rows[0].count);
    
    // Clean up
    await client.query('DELETE FROM waitlist WHERE email = $1', [testEmail]);
    console.log('\n🧹 Test email cleaned up');
    
    console.log('\n✅ Supabase database is working correctly!');
    console.log('\n⚠️  If emails are not being stored from your live site:');
    console.log('   1. Check that POSTGRES_URL is set in Vercel');
    console.log('   2. Check Vercel function logs for errors');
    console.log('   3. Make sure you deployed the latest code');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testInsert();
