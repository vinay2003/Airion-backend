const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  try {
    await client.connect();
    
    // First, let's create a cart for one of the users
    const userId = '92a4b1cc-4d46-4154-8de7-6dbc7eb38bf8'; // rishabr126@gmail.com
    
    let cartRes = await client.query(`SELECT id FROM carts WHERE "userId" = $1`, [userId]);
    let cartId;
    
    if (cartRes.rows.length === 0) {
        cartRes = await client.query(`INSERT INTO carts ("userId") VALUES ($1) RETURNING id`, [userId]);
    }
    
    cartId = cartRes.rows[0].id;
    console.log('Cart ID:', cartId);
    
    const res = await client.query(`
        INSERT INTO cart_items ("cartId", "itemType", "referenceId", "quantity", "metadata")
        VALUES ($1, 'MERCHANDISE', 'm1', 1, '{}'::jsonb)
        RETURNING *;
    `, [cartId]);
    
    console.log('Inserted:', res.rows[0]);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
