import pg from 'pg';
const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_Fc6ei0IpVfhQ@ep-crimson-heart-b5ixqxaa-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await pool.query(`
    UPDATE profile 
    SET phone1 = '+92 3152931751',
        phone2 = '+92 3032130577',
        updated_at = NOW()
    WHERE id = (SELECT id FROM profile ORDER BY id ASC LIMIT 1)
  `);
  console.log('Phone numbers updated in database successfully.');
  await pool.end();
}

main();
