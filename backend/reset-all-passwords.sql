-- Reset all user passwords to: password123
-- Hash generated with bcrypt (12 rounds): $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW8UfzOmi

USE ums_db;
GO

UPDATE [User] 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW8UfzOmi'
WHERE username IN ('admin', 'jsmith', 'mjohnson', 'rperera', 'sfernando', 'asilva', 'ndias', 'kwijesinghe', 'pweerasinghe', 'dbandara', 'tgunasekara', 'lranasinghe', 'mgamage');

GO

-- Verify update
SELECT username, user_role, LEN(password_hash) as hash_length
FROM [User]
ORDER BY user_role, username;

GO
