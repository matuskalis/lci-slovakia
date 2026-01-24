-- Complete reset and setup of Supabase Storage and photos table
-- This script handles existing policies and objects properly

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view published photos" ON photos;
DROP POLICY IF EXISTS "Authenticated users can manage photos" ON photos;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop and recreate photos table
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT NOT NULL,
  alt_text TEXT,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT 'image/jpeg',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_published ON photos(is_published);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for photos table
CREATE POLICY "Public can view published photos" ON photos
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can manage photos" ON photos
  FOR ALL USING (auth.role() = 'authenticated');

-- Delete existing storage bucket if it exists
DELETE FROM storage.buckets WHERE id = 'wildlife-photos';

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wildlife-photos',
  'wildlife-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies
CREATE POLICY "Public can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'wildlife-photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'wildlife-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'wildlife-photos' AND
    auth.role() = 'authenticated'
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify setup
SELECT 
  'Storage bucket created' as status,
  (SELECT COUNT(*) FROM storage.buckets WHERE id = 'wildlife-photos') as bucket_count;

SELECT 
  'Photos table created' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'photos') as table_count;

-- Show created policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('photos') OR (schemaname = 'storage' AND tablename = 'objects');

COMMIT;
