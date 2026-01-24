-- Verify blog_posts table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;

-- Check if table exists and has data
SELECT COUNT(*) as total_posts FROM blog_posts;

-- Show sample data
SELECT id, title, author, category, published, created_at 
FROM blog_posts 
ORDER BY created_at DESC 
LIMIT 5;
