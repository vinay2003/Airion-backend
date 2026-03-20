const { Client } = require('pg');

async function fetchUsers() {
    const databaseUrl = 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        const res = await client.query('SELECT * FROM users LIMIT 10');
        console.log("USERS:", JSON.stringify(res.rows, null, 2));

        const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("TABLES:", tables.rows.map(r => r.table_name));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fetchUsers();
