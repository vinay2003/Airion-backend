const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  try {
    await client.connect();
    
    await client.query(`TRUNCATE TABLE cart_items CASCADE;`);
    console.log('cart_items truncated successfully.');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
