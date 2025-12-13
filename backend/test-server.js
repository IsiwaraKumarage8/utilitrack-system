// Simple test script to verify server setup
const http = require('http');

console.log('\n🧪 Testing Backend Server Setup...\n');

// Wait for server to start
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('✅ Health Check Response:');
      console.log(data);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ SERVER SETUP SUCCESSFUL!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Server is not responding:', error.message);
    console.error('\nMake sure the server is running: npm run dev\n');
    process.exit(1);
  });

  req.end();
}, 2000);
