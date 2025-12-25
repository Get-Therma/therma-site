import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { setDefaultResultOrder } from 'node:dns';

// Force Node to prefer IPv4 results when a host resolves to both IPv4/IPv6.
// This prevents ENETUNREACH errors on networks without IPv6 support.
try {
  setDefaultResultOrder('ipv4first');
} catch (err) {
  // Older Node versions might not support this API—safe to ignore.
  console.warn('DNS result order not set:', err);
}

// Use connection string from environment variable
let connectionString = process.env.POSTGRES_URL || 'postgresql://postgres:TeamTherma123!@db.ooaqigzgvrmyomfbdygz.supabase.co:5432/postgres';

// Use Supabase connection pooler (port 6543) to avoid IPv6 connection issues
// The pooler is specifically designed to handle these network issues
if (connectionString.includes(':5432/')) {
  // Replace port 5432 with 6543 for connection pooler
  connectionString = connectionString.replace(':5432/', ':6543/');
  
  // Add pgbouncer parameter for transaction mode
  if (!connectionString.includes('?')) {
    connectionString += '?pgbouncer=true';
  } else if (!connectionString.includes('pgbouncer')) {
    connectionString += '&pgbouncer=true';
  }
}

const client = postgres(connectionString, {
  ssl: 'require',
  connect_timeout: 8,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  max: 1, // Limit connections for serverless
  prepare: false, // Disable prepared statements for better compatibility
  transform: {
    undefined: null,
  },
  onnotice: () => {}, // Suppress notices
});

export const db = drizzle(client, { schema });

// Also export as getDb function for compatibility with newer API routes
export const getDb = async () => {
  try {
    return db;
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    if (error.code === 'ENETUNREACH') {
      console.error('IPv6 connection issue detected. Consider using Supabase connection pooler.');
    }
    throw error;
  }
};
