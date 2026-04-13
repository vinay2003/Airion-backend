const { Client } = require('pg');
const crypto = require('crypto');

async function seedAdmin() {
    // Standard connection string from your environment
    const databaseUrl = 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    const ADMIN_PHONE = '1000000000';
    const ADMIN_EMAIL = 'admin@ease2event.com';

    try {
        await client.connect();
        console.log("Connected to database for admin seeding...");

        // Check if exists
        const check = await client.query('SELECT id FROM users WHERE role = $1 OR phone_number = $2', ['admin', ADMIN_PHONE]);
        
        if (check.rows.length > 0) {
            console.log("⚠️ Admin record already exists. Updating phone number if necessary...");
            await client.query(`
                UPDATE users 
                SET phone_number = $1, name = $2 
                WHERE role = $3
            `, [ADMIN_PHONE, 'System Administrator', 'admin']);
        } else {
            console.log("🚀 Creating new Admin record...");
            await client.query(`
                INSERT INTO users (id, name, email, phone_number, password, role, email_verified)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                crypto.randomUUID(), 
                'System Administrator', 
                ADMIN_EMAIL, 
                ADMIN_PHONE, 
                'admin-otp-protected', 
                'admin', 
                true
            ]);
        }

        console.log("✅ Admin seeding complete!");
        console.log(`📱 Admin Phone: ${ADMIN_PHONE}`);
    } catch (err) {
        console.error('❌ Error Seeding Admin:', err);
    } finally {
        await client.end();
    }
}

seedAdmin();
