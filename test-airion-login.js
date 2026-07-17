const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login/verify-otp', {
      phone: '9999999999',
      otp: '123456',
      role: 'VENDOR'
    });
    console.log(res.data);
  } catch(e) { 
    console.error('Error:', e.response?.data || e.message);
  }
}
test();
