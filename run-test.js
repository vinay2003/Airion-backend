const { execSync } = require('child_process');
const axios = require('axios');

async function test() {
  try {
    // We will just run a curl or axios
    // Actually, to trigger verifyLoginOTP, we need an OTP.
    // Let's just create an OTP in the database using raw SQL!
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
    });
    await client.connect();
    
    // Check if phone 9999999999 exists as user
    const userRes = await client.query("SELECT * FROM users WHERE phone_number = '9999999999' OR phone_number = '+919999999999'");
    if (userRes.rows.length === 0) {
      console.log("No user with phone 9999999999 found. You should use a phone number that belongs to a vendor!");
      
      // Let's find a vendor
      const vendorRes = await client.query("SELECT u.phone_number FROM vendors v JOIN users u ON v.user_id = u.id LIMIT 1");
      if (vendorRes.rows.length > 0) {
        console.log("Found vendor phone:", vendorRes.rows[0].phone_number);
        process.env.TEST_PHONE = vendorRes.rows[0].phone_number;
      } else {
        console.log("No vendors found in DB");
        process.exit(1);
      }
    } else {
      process.env.TEST_PHONE = '9999999999';
    }

    const phone = process.env.TEST_PHONE.replace('+91', '');
    
    // Delete existing OTPs
    await client.query("DELETE FROM otps WHERE identifier = $1", [phone]);
    
    // Hash '123456' using bcrypt (wait we need bcrypt, let's just use raw pgcrypto if possible, or we can use node's bcrypt)
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('123456', 10);
    
    // Insert OTP
    await client.query(`
      INSERT INTO otps (identifier, otp, expires_at, type, created_at) 
      VALUES ($1, $2, $3, $4, NOW())
    `, [phone, hash, new Date(Date.now() + 10 * 60000), 'login']);
    
    console.log("Inserted OTP 123456 for phone", phone);
    await client.end();
    
    // Now make the request!
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login/verify-otp', {
        phone: phone,
        otp: '123456',
        role: 'vendor'
      });
      console.log("SUCCESS!", res.status);
    } catch (err) {
      console.log("ERROR!", err.response ? err.response.status : err.message);
      if (err.response) {
         console.log(err.response.data);
      }
    }
  } catch(e) {
    console.error(e);
  }
}
test();
