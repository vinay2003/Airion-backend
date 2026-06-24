const axios = require('axios');
async function run() {
  try {
    // Assuming we need a token, we might get 401. Let's just see.
    const res = await axios.post('http://localhost:3000/api/vendors/ads', { title: 'Test', imageUrl: 'http', budget: 100 });
    console.log(res.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
run();
