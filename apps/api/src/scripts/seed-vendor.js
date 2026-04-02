const { Client } = require('pg');

async function seedVendor() {
    const databaseUrl = 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        
        // Let's create UUIDs using Node crypto since SQL might not have gen_random_uuid() enabled
        const crypto = require('crypto');
        const vendorId1 = crypto.randomUUID();
        const vendorId2 = crypto.randomUUID();
        
        console.log("Seeding vendors row index...");
        
        // Check first if already seeded from other turns 
        const check = await client.query('SELECT id FROM vendors LIMIT 1');
        if (check.rows.length > 0) {
             console.log("✅ Vendor nodes already exist inside DB! ID:", check.rows[0].id);
             return;
        }

        // Insert using existing user ID from previous log
        const userId = 'aa6efc48-5efd-4549-a67c-3058b01c7343'; 
        
        await client.query(`
            INSERT INTO vendors (id, user_id, business_name, is_verified, verification_status) 
            VALUES ($1, $2, $3, $4, $5)
        `, [vendorId1, userId, 'Grand Heritage Hotel', true, 'approved']);

        console.log(`✅ Seeded Vendor 1 correctly! VendorID: ${vendorId1}`);

    } catch (err) {
        console.error('Error Seeding:', err);
    } finally {
        await client.end();
    }
}

seedVendor();
