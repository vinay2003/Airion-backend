const { Client } = require('pg');
const crypto = require('crypto');

async function seedAdmins() {
    const databaseUrl = 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    const ADMINS = [
        { phone: '9616981292', name: 'Vinay Sharma',  email: 'vinaysharma31681@gmail.com' },
        { phone: '8130607796', name: 'Admin 2',        email: 'admin2@airion.com' },
    ];

    try {
        await client.connect();
        console.log('Connected to database for admin seeding...');

        for (const admin of ADMINS) {
            // Check if a record already exists with this phone or email
            const check = await client.query(
                `SELECT id FROM users WHERE phone_number = $1 OR email = $2`,
                [admin.phone, admin.email]
            );

            if (check.rows.length > 0) {
                console.log(`⚠️  Admin ${admin.phone} already exists — updating role & phone...`);
                await client.query(
                    `UPDATE users SET phone_number = $1, role = 'admin', name = $2 WHERE phone_number = $1 OR email = $3`,
                    [admin.phone, admin.name, admin.email]
                );
            } else {
                console.log(`🚀 Creating admin record for ${admin.phone}...`);
                await client.query(
                    `INSERT INTO users (id, name, email, phone_number, password, role, email_verified)
                     VALUES ($1, $2, $3, $4, $5, 'admin', true)`,
                    [crypto.randomUUID(), admin.name, admin.email, admin.phone, 'admin-otp-protected']
                );
            }

            console.log(`✅ Admin ready: ${admin.name} (${admin.phone})`);
        }

        console.log('\n🎉 All admin records seeded successfully!');
    } catch (err) {
        console.error('❌ Error seeding admins:', err);
    } finally {
        await client.end();
    }
}

seedAdmins();
