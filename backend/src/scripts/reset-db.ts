const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function resetDb() {
    console.log('🔄 Starting Database Reset...');

    // 1. Load .env manually
    const envPath = path.resolve(__dirname, '../../../.env');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found at:', envPath);
        process.exit(1);
    }

    const envConfig = fs.readFileSync(envPath, 'utf-8');
    const dbUrlMatch = envConfig.match(/DATABASE_URL=(.*)/);

    if (!dbUrlMatch || !dbUrlMatch[1]) {
        console.error('❌ DATABASE_URL not found in .env');
        process.exit(1);
    }

    const databaseUrl = dbUrlMatch[1].trim().replace(/["']/g, ''); // Remove quotes if any
    console.log('✅ Found DATABASE_URL');

    // 2. Connect to DB
    const client = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }, // Required for NeonDB
    });

    try {
        await client.connect();
        console.log('✅ Connected to Database');

        // 3. Check current count
        const countResult = await client.query('SELECT COUNT(*) FROM users');
        console.log(`📊 Current User Count: ${countResult.rows[0].count}`);

        // 4. Truncate
        console.log('🗑 Truncating users table...');
        await client.query('TRUNCATE TABLE users CASCADE');

        console.log('✅ Database Reset Successful! All users removed.');

    } catch (err) {
        console.error('❌ Error resetting database:', err);
    } finally {
        await client.end();
    }
}

resetDb();
