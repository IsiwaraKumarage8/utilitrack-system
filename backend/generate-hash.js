const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\n=== Password Hash Generator ===');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Update Statement:');
  console.log(`UPDATE [User] SET password_hash = '${hash}' WHERE username = 'admin';`);
  console.log('\n');
  
  // Test verification
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification test:', isValid ? '✓ PASS' : '✗ FAIL');
}

generateHash();
