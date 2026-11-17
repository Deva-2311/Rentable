const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email: 'admin@rentable.com', password: 'password123' });
    const token = res.data.token;
    console.log("Token:", token);
    const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Stats:", statsRes.status);
  } catch (err) {
    console.error(err.response?.status, err.response?.data);
  }
}
run();
