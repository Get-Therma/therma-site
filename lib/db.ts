import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use connection string to avoid IPv6 issues
const connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:Theartistpass123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres?sslmode=require&connect_timeout=10';

const client = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 15,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
  max: 1, // Limit connections for local development
  prepare: false, // Disable prepared statements for better compatibility
});

export const db = drizzle(client, { schema });
