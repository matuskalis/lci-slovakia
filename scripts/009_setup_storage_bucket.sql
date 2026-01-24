-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Note: RLS policies for storage.objects are typically managed by Supabase automatically
-- If you need custom policies, they should be created through the Supabase Dashboard
-- under Storage > Policies, not through SQL scripts

-- The bucket creation above should be sufficient for basic functionality
-- The bucket is set to public=true which allows public read access
-- Authenticated users can upload through the Supabase client libraries
