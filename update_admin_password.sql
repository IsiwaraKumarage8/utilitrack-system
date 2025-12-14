-- Update admin password with proper bcrypt hash
-- Password: admin123

USE ums_db;
GO

DECLARE @password_hash VARCHAR(255) = '$2a$12$J0GyTBjNgg.ZOLopeE//Xec9N4jdTjTp0M9AEoZLPxzBioYh/f5e6';

UPDATE [User] 
SET password_hash = @password_hash
WHERE username = 'admin';

-- Verify the update
SELECT 
    username, 
    LEN(password_hash) as hash_length,
    password_hash
FROM [User] 
WHERE username = 'admin';
GO
