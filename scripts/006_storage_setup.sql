-- Create storage bucket for observation photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('observation-photos', 'observation-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view observation photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'observation-photos');

CREATE POLICY "Uploaders and admins can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'observation-photos' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'uploader')
        )
    );

CREATE POLICY "Users can update own photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'observation-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Admins can delete any photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'observation-photos' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Set bucket size limit (50MB per file)
UPDATE storage.buckets 
SET file_size_limit = 52428800 
WHERE id = 'observation-photos';

-- Set allowed MIME types
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
WHERE id = 'observation-photos';
