import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use connection string from environment variable
const connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres';

const client = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 15,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
  max: 1, // Limit connections for serverless
  prepare: false, // Disable prepared statements for better compatibility
});

export const db = drizzle(client, { schema });

// Also export as getDb function for compatibility with newer API routes
export const getDb = async () => db;
