-- Verification script to check if everything was set up correctly

-- Check if photos table exists and has correct structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- Check if RLS is enabled on photos table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'photos';

-- Check RLS policies on photos table
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'photos';

-- Count existing photos in the table
SELECT 
  category,
  COUNT(*) as photo_count
FROM photos 
GROUP BY category
ORDER BY category;

-- Show sample of inserted photos
SELECT 
  id,
  filename,
  category,
  description,
  created_at
FROM photos 
ORDER BY created_at DESC
LIMIT 10;

-- Check if storage bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'photos';

-- Check storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%photos%';

-- Check if triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'photos';

-- Check if functions exist
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'update_updated_at_column';
