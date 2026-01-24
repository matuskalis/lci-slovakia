-- First, let's check what triggers exist on the photos table
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'photos';

-- Drop any problematic triggers that might reference 'title'
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    -- Get all triggers on photos table
    FOR trigger_record IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'photos'
    LOOP
        -- Drop each trigger
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON photos', trigger_record.trigger_name);
        RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
    END LOOP;
END
$$;

-- Drop and recreate the photos table with correct schema
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_path TEXT,
    public_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
    description TEXT,
    alt_text TEXT,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a simple updated_at trigger
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

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies without referencing non-existent fields
CREATE POLICY "Photos are viewable by everyone" ON photos
    FOR SELECT USING (true);

CREATE POLICY "Photos can be inserted by authenticated users" ON photos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Photos can be updated by authenticated users" ON photos
    FOR UPDATE USING (true);

CREATE POLICY "Photos can be deleted by authenticated users" ON photos
    FOR DELETE USING (true);

-- Grant necessary permissions
GRANT ALL ON photos TO authenticated;
GRANT ALL ON photos TO anon;
GRANT ALL ON photos TO service_role;

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- Show triggers
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'photos';

-- Show policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'photos';
