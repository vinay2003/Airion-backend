const { Client } = require('pg');

async function createAdmin() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });

  try {
    await client.connect();
    
    const email = 'admin@ease2event.com';
    
    // Check if user exists
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (res.rows.length > 0) {
      // Update role to admin
      await client.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
      console.log(`Updated existing user ${email} to ADMIN role.`);
    } else {
      // Insert new admin user
      await client.query(`
        INSERT INTO users (email, name, role, email_verified) 
        VALUES ($1, $2, 'admin', true)
      `, [email, 'Admin User']);
      console.log(`Created new ADMIN user: ${email}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createAdmin();
