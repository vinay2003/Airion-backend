const { Client } = require('pg');
const crypto = require('crypto');

async function seedPackages() {
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ql0bTeKuP7QZ@ep-blue-firefly-axkc7bjg-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log("Connected to database to seed packages...");
        
        await client.query('DELETE FROM service_packages');
        console.log("Cleared old packages.");

        const servicesRes = await client.query('SELECT id, base_price FROM services LIMIT 10');
        const services = servicesRes.rows;

        if (services.length === 0) {
            console.log("No services found. Run seed-all.js first.");
            return;
        }

        console.log(`Found ${services.length} services. Adding packages...`);

        for (const svc of services) {
            const base = Number(svc.base_price) || 10000;
            
            const packages = [
                {
                    name: 'Essential Package',
                    description: 'Perfect for small gatherings. Includes core features.',
                    price: base * 0.8,
                    features: ['Basic Setup', '4 Hours Coverage', 'Standard Support']
                },
                {
                    name: 'Premium Package',
                    description: 'Our most popular choice. Comprehensive coverage for your special day.',
                    price: base * 1.5,
                    features: ['Premium Setup', '8 Hours Coverage', 'Priority Support', 'Custom Requests']
                },
                {
                    name: 'Luxury Elite Package',
                    description: 'The ultimate VIP experience with all-inclusive premium features.',
                    price: base * 2.5,
                    features: ['Luxury Setup', 'Full Day Coverage', 'Dedicated Manager', 'Unlimited Revisions', 'Exclusive Add-ons']
                }
            ];

            for (const pkg of packages) {
                await client.query(`
                    INSERT INTO service_packages (id, service_id, name, description, price, features)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [
                    crypto.randomUUID(),
                    svc.id,
                    pkg.name,
                    pkg.description,
                    pkg.price,
                    JSON.stringify(pkg.features)
                ]);
            }
        }

        console.log("✅ Packages seeded successfully!");

    } catch (err) {
        console.error('Error Seeding Packages:', err);
    } finally {
        await client.end();
    }
}

seedPackages();
