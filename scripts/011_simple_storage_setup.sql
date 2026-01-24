-- Simple storage bucket creation without RLS modifications
-- This avoids permission issues with the storage.objects table

-- Create storage bucket for photos (if it doesn't exist)
DO $$
BEGIN
    -- Check if bucket exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'photos') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'photos',
            'photos',
            true,
            10485760, -- 10MB limit
            ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        );
        
        RAISE NOTICE 'Storage bucket "photos" created successfully';
    ELSE
        RAISE NOTICE 'Storage bucket "photos" already exists';
    END IF;
END $$;

-- Verify bucket creation
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'photos';
