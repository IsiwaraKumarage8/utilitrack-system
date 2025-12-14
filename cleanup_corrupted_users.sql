-- Clean up corrupted user accounts
-- Keep only the admin user with valid password

USE ums_db;
GO

-- Delete all users with corrupted password hashes (length != 60)
DELETE FROM [User]
WHERE LEN(password_hash) != 60;
GO

-- Show remaining users
SELECT 
    username, 
    full_name, 
    user_role, 
    LEN(password_hash) as hash_length
FROM [User]
ORDER BY username;
GO

PRINT 'Corrupted user accounts removed.';
PRINT 'Only users with valid 60-character bcrypt hashes remain.';
GO
