-- First, try to create the wildlife-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wildlife-photos',
  'wildlife-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Create storage policies for the wildlife-photos bucket
-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for wildlife photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload wildlife photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own wildlife photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own wildlife photos" ON storage.objects;

-- Create new policies
CREATE POLICY "Public read access for wildlife photos" ON storage.objects
FOR SELECT USING (bucket_id = 'wildlife-photos');

CREATE POLICY "Authenticated users can upload wildlife photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'wildlife-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own wildlife photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'wildlife-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own wildlife photos" ON storage.objects
FOR DELETE USING (bucket_id = 'wildlife-photos' AND auth.role() = 'authenticated');
