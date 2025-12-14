const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    console.log('URL: http://localhost:5000/api/auth/login');
    console.log('Credentials: admin / admin123\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✓ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('✗ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received - Server may not be running');
      console.log('Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
