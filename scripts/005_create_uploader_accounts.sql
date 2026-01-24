-- Helper queries to manage user roles
-- Run these after creating user accounts in Supabase Auth

-- 1. First, view all existing users and their roles
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;

-- 2. Set a user as admin (replace email with your admin email)
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-admin@example.com';

-- 3. Set users as uploaders (replace emails with photographer emails)
-- UPDATE public.profiles 
-- SET role = 'uploader' 
-- WHERE email IN (
--     'photographer1@example.com',
--     'photographer2@example.com',
--     'researcher@example.com'
-- );

-- 4. View users by role
SELECT 
    role,
    COUNT(*) as count,
    array_agg(email) as emails
FROM public.profiles 
GROUP BY role;

-- 5. Remove upload permissions (set back to regular user)
-- UPDATE public.profiles 
-- SET role = 'user' 
-- WHERE email = 'user-to-demote@example.com';

-- 6. Check who can upload
SELECT 
    email,
    full_name,
    role,
    CASE 
        WHEN role IN ('admin', 'uploader') THEN 'Can upload'
        ELSE 'Cannot upload'
    END as upload_permission
FROM public.profiles
ORDER BY role, email;
