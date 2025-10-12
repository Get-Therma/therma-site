import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use individual connection parameters to avoid IPv6 issues
const client = postgres({
  host: 'db.ooaqigzgvrmyomfbdygz.supabase.co',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'Theartistpass123!',
  ssl: 'require',
  connect_timeout: 15,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
  max: 1, // Limit connections for local development
  prepare: false, // Disable prepared statements for better compatibility
  family: 4, // Force IPv4 connection
});

export const db = drizzle(client, { schema });
