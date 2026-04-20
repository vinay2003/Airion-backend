const { Client } = require('pg');
const crypto = require('crypto');

async function seedAll() {
    const databaseUrl = 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log("Connected to database for full seeding...");

        // 1. Setup Categories
        console.log("Seeding Categories & Subcategories...");
        const categories = [
            { name: 'Weddings', slug: 'weddings', icon: 'Heart', description: 'Plan your dream wedding' },
            { name: 'Birthdays', slug: 'birthdays', icon: 'Cake', description: 'Fun setup for your birthday' },
            { name: 'Corporate', slug: 'corporate', icon: 'Briefcase', description: 'Professional office events' }
        ];

        const insertedCats = {};
        for (const cat of categories) {
            const res = await client.query(`
                INSERT INTO categories (id, name, slug, icon, description) 
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
                RETURNING id, slug
            `, [crypto.randomUUID(), cat.name, cat.slug, cat.icon, cat.description]);
            insertedCats[cat.slug] = res.rows[0].id;
        }

        // 2. Setup Subcategories
        const subcategories = [
            { catSlug: 'weddings', name: 'Venues', slug: 'wedding-venues', description: 'Grand ballrooms' },
            { catSlug: 'weddings', name: 'Photography', slug: 'wedding-photography', description: 'Picture framing' },
            { catSlug: 'birthdays', name: 'Themes', slug: 'birthday-themes', description: 'Balloon clusters' },
            { catSlug: 'corporate', name: 'Boardrooms', slug: 'corporate-boardrooms', description: 'Meetings' }
        ];

        const insertedSubs = {};
        for (const sub of subcategories) {
            const catId = insertedCats[sub.catSlug];
            const res = await client.query(`
                INSERT INTO subcategories (id, category_id, name, slug, description)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
                RETURNING id, slug
            `, [crypto.randomUUID(), catId, sub.name, sub.slug, sub.description]);
            insertedSubs[sub.slug] = res.rows[0].id;
        }

        // 3. Setup Vendors with unique Users
        console.log("Seeding Vendors...");

        async function createVendorUser(name, email, businessName) {
            const uId = crypto.randomUUID();
            const vId = crypto.randomUUID();

            const check = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            let finalUserId = check.rows.length ? check.rows[0].id : null;

            if (!finalUserId) {
                await client.query(`
                    INSERT INTO users (id, name, email, password, role, email_verified)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [uId, name, email, 'hashedpassword', 'vendor', true]);
                finalUserId = uId;
            }

            const checkVendor = await client.query('SELECT id FROM vendors WHERE user_id = $1', [finalUserId]);
            if (!checkVendor.rows.length) {
                await client.query(`
                    INSERT INTO vendors (id, user_id, business_name, is_verified, verification_status) 
                    VALUES ($1, $2, $3, $4, $5)
                `, [vId, finalUserId, businessName, true, 'approved']);
                return vId;
            } else {
                return checkVendor.rows[0].id;
            }
        }

        const vendorId1 = await createVendorUser('Hotel Manager', 'grandhotel@example.com', 'Grand Heritage Hotel');
        const vendorId2 = await createVendorUser('Photographer Bob', 'pixelbob@example.com', 'Pixel Perfect Photography');

        // 4. Setup Services
        console.log("Seeding Services...");
        const services = [
            {
                id: crypto.randomUUID(),
                vendorId: vendorId1,
                categoryId: insertedCats['weddings'],
                subcategoryId: insertedSubs['wedding-venues'],
                title: 'Royal Heritage Ballroom',
                slug: 'royal-heritage-ballroom',
                description: 'Luxury ballroom space with exquisite lighting perfect for grand weddings.',
                basePrice: 75000,
                images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80'],
                features: [{ name: 'AC Hall', included: true }, { name: 'Catering Included', included: false }]
            },
            {
                id: crypto.randomUUID(),
                vendorId: vendorId2,
                categoryId: insertedCats['weddings'],
                subcategoryId: insertedSubs['wedding-photography'],
                title: 'Cinematic Pre-Wedding Shoot',
                slug: 'cinematic-pre-wedding-shoot',
                description: 'Cinematic captures using high-res arrays framed by expert editors.',
                basePrice: 35000,
                images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'],
                features: [{ name: 'HD Video', included: true }, { name: 'Drone Shots', included: true }]
            }
        ];

        for (const svc of services) {
            const res = await client.query(`
                INSERT INTO services (id, vendor_id, category_id, subcategory_id, title, slug, description, base_price, currency, images, features)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (slug) DO UPDATE SET images = EXCLUDED.images
                RETURNING id
            `, [
                svc.id,
                svc.vendorId,
                svc.categoryId,
                svc.subcategoryId,
                svc.title,
                svc.slug,
                svc.description,
                svc.basePrice,
                'INR',
                svc.images,
                JSON.stringify(svc.features)
            ]);

            const dbServiceId = res.rows[0].id;

            await client.query(`
                INSERT INTO service_packages (id, service_id, name, description, price, features)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [
                crypto.randomUUID(),
                dbServiceId,
                'Premium Package',
                'Covers everything described with fully customizable frames.',
                svc.basePrice + 10000,
                JSON.stringify({ included: ['Food', 'Drinks'] })
            ]);
        }

        console.log("✅ All seeding complete!");

    } catch (err) {
        console.error('Error Seeding:', err);
    } finally {
        await client.end();
    }
}

seedAll();
