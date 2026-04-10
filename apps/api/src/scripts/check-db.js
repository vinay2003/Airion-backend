const { Client } = require('pg');
require('dotenv').config({ path: '../../.env' }); // Look for root .env

async function checkUsers() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM users');
        console.log('--- DB STATS ---');
        console.log(`Total users: ${res.rows[0].count}`);
        
        const admin = await client.query("SELECT id, name, role, phone_number FROM users WHERE role = 'admin'");
        console.log(`Admins found: ${admin.rowCount}`);
        if (admin.rowCount > 0) {
            console.log('Admins:', admin.rows);
        }

        const sample = await client.query('SELECT name, email, role FROM users LIMIT 5');
        console.log('Sample Users:', sample.rows);

    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await client.end();
    }
}

checkUsers();
