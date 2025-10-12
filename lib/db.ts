import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

// Lazy database connection to avoid build-time connection issues
export const getDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  // Skip database connection during build process
  if (process.env.NODE_ENV === 'production' && !process.env.POSTGRES_URL) {
    throw new Error('Database not configured for production');
  }

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

  dbInstance = drizzle(client, { schema });
  return dbInstance;
};

// Export for backward compatibility - but this will cause issues during build
// export const db = getDb();
