import pg from 'pg';
const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_Fc6ei0IpVfhQ@ep-crimson-heart-b5ixqxaa-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

main();
