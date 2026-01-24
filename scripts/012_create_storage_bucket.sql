-- Create the photos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the photos bucket
-- Allow public read access
CREATE POLICY "Public read access for photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Users can update their own photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
