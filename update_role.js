const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function updateRole() {
    try {
        await client.connect();
        console.log('Connected to DB');
        const res = await client.query("UPDATE users SET role = 'vendor' WHERE phone_number = '+916204376404' OR phone_number = '6204376404'");
        console.log('Rows affected:', res.rowCount);
        client.end();
    } catch (err) {
        console.error('Error updating role:', err);
        process.exit(1);
    }
}

updateRole();
