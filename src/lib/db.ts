import { Pool } from 'pg';

let pool: Pool;

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Fc6ei0IpVfhQ@ep-crimson-heart-b5ixqxaa-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });
} else {
  // Prevent hot-reload from exhausting connections
  const globalWithPg = global as typeof globalThis & { _neonPool?: Pool };
  if (!globalWithPg._neonPool) {
    globalWithPg._neonPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  pool = globalWithPg._neonPool;
}

export default pool;

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}
