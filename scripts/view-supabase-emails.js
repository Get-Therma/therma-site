const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function viewEmails() {
  const client = await pool.connect();
  
  try {
    console.log('📧 SUPABASE EMAIL DATABASE\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Get total count
    const countResult = await client.query('SELECT COUNT(*) FROM waitlist');
    const total = parseInt(countResult.rows[0].count);
    console.log(`Total emails: ${total}\n`);
    
    if (total === 0) {
      console.log('No emails in database yet.\n');
      return;
    }
    
    // Get recent emails
    const result = await client.query(`
      SELECT 
        id,
        email,
        attribution,
        created_at
      FROM waitlist 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    console.log('Recent emails:\n');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.email}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Created: ${new Date(row.created_at).toLocaleString()}`);
      if (row.attribution) {
        try {
          const attr = JSON.parse(row.attribution);
          console.log(`   Source: ${attr.source || 'N/A'}`);
          if (attr.utm_source) console.log(`   UTM Source: ${attr.utm_source}`);
          if (attr.utm_campaign) console.log(`   UTM Campaign: ${attr.utm_campaign}`);
        } catch (e) {
          console.log(`   Attribution: ${row.attribution}`);
        }
      }
      console.log('');
    });
    
    if (total > 20) {
      console.log(`... and ${total - 20} more emails\n`);
    }
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

viewEmails();




