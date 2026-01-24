-- Complete reset and setup of Supabase Storage and Photos table
-- Run this script to fix all storage and database issues

-- 1. Drop existing photos table and recreate with correct schema
DROP TABLE IF EXISTS photos CASCADE;

-- 2. Create photos table with all required columns
CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
    description TEXT NOT NULL,
    alt_text TEXT,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photos_updated_at 
    BEFORE UPDATE ON photos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable RLS on photos table
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for photos table
-- Allow public read access to published photos
CREATE POLICY "Public can view published photos" ON photos
    FOR SELECT USING (is_published = true);

-- Allow authenticated users to view all photos
CREATE POLICY "Authenticated users can view all photos" ON photos
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to do everything
CREATE POLICY "Service role can do everything on photos" ON photos
    FOR ALL USING (auth.role() = 'service_role');

-- 6. Delete existing storage bucket if it exists
DELETE FROM storage.buckets WHERE id = 'wildlife-photos';

-- 7. Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'wildlife-photos',
    'wildlife-photos',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- 8. Create storage policies
-- Allow public read access
CREATE POLICY "Public can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'wildlife-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'wildlife-photos' 
        AND auth.role() = 'authenticated'
    );

-- Allow service role to do everything
CREATE POLICY "Service role can manage all photos" ON storage.objects
    FOR ALL USING (
        bucket_id = 'wildlife-photos' 
        AND auth.role() = 'service_role'
    );

-- Allow authenticated users to update their own uploads
CREATE POLICY "Users can update photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'wildlife-photos' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete photos
CREATE POLICY "Users can delete photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'wildlife-photos' 
        AND auth.role() = 'authenticated'
    );

-- 9. Create indexes for better performance
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_is_published ON photos(is_published);
CREATE INDEX idx_photos_storage_path ON photos(storage_path);

-- 10. Insert some test data to verify everything works
INSERT INTO photos (
    filename,
    original_filename,
    storage_path,
    public_url,
    category,
    description,
    alt_text,
    file_size,
    mime_type
) VALUES 
(
    'test-photo.jpg',
    'test-photo.jpg',
    'medved/test-photo.jpg',
    'https://example.com/test-photo.jpg',
    'medved',
    'Test photo of a brown bear',
    'Brown bear in forest',
    1024000,
    'image/jpeg'
);

-- 11. Verify the setup
SELECT 'Photos table created successfully' as status;
SELECT 'Storage bucket created successfully' as status;
SELECT 'Test data inserted successfully' as status;

-- 12. Show current photos count
SELECT COUNT(*) as total_photos FROM photos;

-- 13. Show storage bucket info
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'wildlife-photos';
