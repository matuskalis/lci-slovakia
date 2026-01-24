-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos', 
  'photos', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for photos bucket
DROP POLICY IF EXISTS "Photos are publicly accessible" ON storage.objects;
CREATE POLICY "Photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
CREATE POLICY "Anyone can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "Anyone can update photos" ON storage.objects;
CREATE POLICY "Anyone can update photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Anyone can delete photos" ON storage.objects;
CREATE POLICY "Anyone can delete photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos');
