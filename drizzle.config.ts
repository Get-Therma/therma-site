import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'db.ooaqigzgvrmyomfbdygz.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'Theartistpass123!',
    ssl: true,
  },
});
