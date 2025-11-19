-- Script to create an admin user account
-- Replace 'your-email@example.com' and 'Your Name' with your actual details

-- First, let's check if the user already exists
-- Run this to see existing users:
-- SELECT * FROM User;

-- Create admin user (replace the email and name)
INSERT INTO User (id, email, name, role, createdAt, updatedAt, emailVerified) 
VALUES (
  lower(hex(randomblob(16))),
  'your-email@example.com',  -- CHANGE THIS to your email
  'Your Name',                -- CHANGE THIS to your name
  'ADMIN',
  datetime('now'),
  datetime('now'),
  NULL
);

-- Verify the admin was created
SELECT 'Admin user created successfully!' as message;
SELECT * FROM User WHERE role = 'ADMIN';
