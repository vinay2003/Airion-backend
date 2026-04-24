const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function checkVendor() {
    try {
        await client.connect();
        const res = await client.query("SELECT id FROM vendors WHERE \"user_id\" = 'a979cd5f-e724-4e7f-8cd6-a219a4b571f5'");
        console.log('Vendor records:', res.rows);
        if (res.rows.length === 0) {
            console.log('No vendor record found. Creating one...');
            const insertRes = await client.query("INSERT INTO vendors (\"user_id\", \"business_name\", \"verification_status\") VALUES ('a979cd5f-e724-4e7f-8cd6-a219a4b571f5', 'New Vendor Business', 'pending') RETURNING id");
            console.log('Created vendor with ID:', insertRes.rows[0].id);
        }
        client.end();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkVendor();
