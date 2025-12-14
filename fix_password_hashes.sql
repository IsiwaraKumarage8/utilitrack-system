-- Fix all password hashes - trim any whitespace
-- All bcrypt hashes should be exactly 60 characters

USE ums_db;
GO

-- Trim all password hashes
UPDATE [User]
SET password_hash = RTRIM(LTRIM(password_hash));
GO

-- Check the results
SELECT 
    username, 
    LEN(password_hash) as hash_length,
    CASE 
        WHEN LEN(password_hash) = 60 THEN 'OK'
        ELSE 'CORRUPTED'
    END as status
FROM [User]
ORDER BY username;
GO
