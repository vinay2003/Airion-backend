const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
  });
  await client.connect();

  try {
    // 1. Get a user
    const res = await client.query(`SELECT id, email, role FROM users WHERE role = 'vendor' LIMIT 1`);
    if (res.rows.length === 0) {
      console.log('No vendor found');
      return;
    }
    const vendor = res.rows[0];
    console.log('Vendor:', vendor);

    // 2. Insert OTP
    const bcrypt = require('bcrypt');
    const otp = '123456';
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = (Date.now() + 5 * 60 * 1000).toString();
    
    await client.query(`DELETE FROM otp WHERE identifier = $1`, [vendor.email]);
    await client.query(
      `INSERT INTO otp (identifier, otp, "expiresAt", type, attempts) VALUES ($1, $2, $3, 'login', 0)`,
      [vendor.email, hashedOtp, expiresAt]
    );
    console.log('OTP inserted');

    // 3. Verify OTP via HTTP
    const axios = require('axios');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login/verify-otp', {
        email: vendor.email,
        otp: '123456',
        role: 'vendor'
      });
      console.log('Response:', response.data);
    } catch (err) {
      console.error('HTTP Error:', err.response ? err.response.data : err.message);
    }
  } finally {
    await client.end();
  }
}
run();
