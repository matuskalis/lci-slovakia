-- Create admin user and test accounts
-- Run this after storage setup
-- Replace the email with your actual admin email

-- First, you need to sign up through your app or Supabase Auth UI
-- Then run this script to make that user an admin

-- Update user role to admin (replace 'your-admin-email@example.com' with actual email)
UPDATE profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'your-admin-email@example.com';

-- Create uploader test account (optional)
-- You can create this user through the app and then run:
-- UPDATE profiles SET role = 'uploader' WHERE email = 'uploader@test.com';

-- Verify admin user was created
SELECT id, email, role, created_at FROM profiles WHERE role = 'admin';
