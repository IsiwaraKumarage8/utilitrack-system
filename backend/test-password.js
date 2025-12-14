const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating password hashes...\n');
  
  // Generate hash for admin123
  const hash1 = await bcrypt.hash('admin123', 12);
  console.log('admin123 hash:');
  console.log(hash1);
  console.log('');
  
  // Generate hash for password123
  const hash2 = await bcrypt.hash('password123', 12);
  console.log('password123 hash:');
  console.log(hash2);
  console.log('');
  
  // Test the hashes
  const test1 = await bcrypt.compare('admin123', hash1);
  const test2 = await bcrypt.compare('password123', hash2);
  
  console.log('Verification:');
  console.log('admin123 matches:', test1);
  console.log('password123 matches:', test2);
}

generateHashes();
