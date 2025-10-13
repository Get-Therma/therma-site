import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'db.ooaqigzgvrmyomfbdygz.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'Theartistpass123!',
    ssl: true,
  },
});
