-- Set admin user with password: admin123
-- Set all other users with password: password123

USE ums_db;
GO

-- Admin user gets admin123
UPDATE [User] 
SET password_hash = '$2a$12$SYfQLtkY8qQQ6MijImN0CO/zn5RPmZ5Dfx5Vv25aFbeVn09UoNVHG'
WHERE username = 'admin';

-- All other users get password123
UPDATE [User] 
SET password_hash = '$2a$12$JpNKrfKexCIPqVCBjsIFme7b.Wzb8VQD0I1neebizXBpyfPxWv5si'
WHERE username IN ('jsmith', 'mjohnson', 'rperera', 'sfernando', 'asilva', 'ndias', 'kwijesinghe', 'pweerasinghe', 'dbandara', 'tgunasekara', 'lranasinghe', 'mgamage');

GO

-- Verify
SELECT username, user_role, LEN(password_hash) as hash_length, 
       CASE 
         WHEN username = 'admin' THEN 'admin123'
         ELSE 'password123'
       END as password
FROM [User]
ORDER BY user_role, username;

GO
