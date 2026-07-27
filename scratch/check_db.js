const { Client } = require('pg');
require('dotenv').config({ path: '/Users/vinaysharma/Desktop/airion/apps/api/.env.development' });

async function checkDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database successfully!');
    
    // Check if wallets table exists
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tables.rows.map(r => r.table_name));

    // Get the description of wallets and payout_requests tables
    const walletsColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'wallets'
    `);
    console.log('wallets columns:', walletsColumns.rows);

    const payoutColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'payout_requests'
    `);
    console.log('payout_requests columns:', payoutColumns.rows);

    const transactionColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'wallet_transactions'
    `);
    console.log('wallet_transactions columns:', transactionColumns.rows);

  } catch (err) {
    console.error('Error connecting/querying DB:', err);
  } finally {
    await client.end();
  }
}

checkDb();
