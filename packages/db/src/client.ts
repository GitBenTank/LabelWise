import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;
let clientInstance: ReturnType<typeof postgres> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is required. Please set it in your .env.local file. ' +
      'Example: DATABASE_URL=postgresql://user:password@host:port/database'
    );
  }
  
  // Basic URL validation
  try {
    new URL(url);
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected a valid PostgreSQL connection string. ` +
      `Example: postgresql://user:password@host:port/database`
    );
  }
  
  return url;
}

function getDb() {
  if (!dbInstance) {
    const connectionString = getDatabaseUrl();
    clientInstance = postgres(connectionString, { max: 1 });
    dbInstance = drizzle(clientInstance, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

