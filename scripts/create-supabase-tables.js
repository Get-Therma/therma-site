const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('Creating waitlist table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        attribution TEXT,
        referer TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✓ Waitlist table created');

    console.log('Creating contacts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✓ Contacts table created');

    // Verify tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('waitlist', 'contacts');
    `);
    
    console.log('\n✓ Tables in database:', result.rows.map(r => r.table_name).join(', '));
    console.log('\n✓ Supabase database is ready!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();




