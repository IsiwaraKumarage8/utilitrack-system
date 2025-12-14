const bcrypt = require('bcryptjs');

const users = [
  { username: 'asilva', password: 'password123' },
  { username: 'dbandara', password: 'password123' },
  { username: 'kwijesinghe', password: 'password123' },
  { username: 'lranasinghe', password: 'password123' },
  { username: 'mgamage', password: 'password123' },
  { username: 'ndias', password: 'password123' },
  { username: 'pweerasinghe', password: 'password123' },
  { username: 'sfernando', password: 'password123' },
  { username: 'tgunasekara', password: 'password123' }
];

async function generateUpdateStatements() {
  console.log('-- Fix corrupted password hashes');
  console.log('-- Default password for all users: password123');
  console.log('USE ums_db;');
  console.log('GO\n');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 12);
    console.log(`-- User: ${user.username}`);
    console.log(`UPDATE [User] SET password_hash = '${hash}' WHERE username = '${user.username}';`);
  }
  
  console.log('\nGO\n');
  console.log('-- Verify all hashes are now 60 characters');
  console.log('SELECT username, LEN(password_hash) as hash_length FROM [User] ORDER BY username;');
  console.log('GO');
}

generateUpdateStatements();
