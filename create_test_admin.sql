-- Create Test Admin User for Login Testing
-- Password: admin123
-- This script adds a test admin user with a known password

USE ums_db;
GO

-- Delete test user if exists
DELETE FROM [User] WHERE username = 'admin';
GO

-- Insert test admin user
-- Username: admin
-- Password: admin123
-- Password hash generated with bcrypt rounds=12
INSERT INTO [User] (username, password_hash, full_name, email, phone, user_role, department, hire_date, user_status, last_login)
VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWHHb.ZG', 'Test Admin', 'admin@utilityco.com', '0771111111', 'Admin', 'Operations', GETDATE(), 'Active', NULL);
GO

-- Verify the user was created
SELECT 
    username, 
    full_name, 
    email, 
    user_role, 
    department, 
    user_status
FROM [User]
WHERE username = 'admin';
GO

PRINT 'Test admin user created successfully!';
PRINT 'Username: admin';
PRINT 'Password: admin123';
GO
