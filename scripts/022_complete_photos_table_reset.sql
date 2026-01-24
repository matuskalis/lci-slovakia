-- Drop all existing policies first
DROP POLICY IF EXISTS "Photos are viewable by everyone" ON photos;
DROP POLICY IF EXISTS "Photos can be inserted by authenticated users" ON photos;
DROP POLICY IF EXISTS "Photos can be updated by authenticated users" ON photos;
DROP POLICY IF EXISTS "Photos can be deleted by authenticated users" ON photos;
DROP POLICY IF EXISTS "Enable read access for all users" ON photos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON photos;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON photos;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON photos;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
DROP TRIGGER IF EXISTS set_timestamp ON photos;
DROP TRIGGER IF EXISTS handle_updated_at ON photos;

-- Drop all functions that might be causing issues
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS set_timestamp() CASCADE;

-- Drop and recreate the photos table completely
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
    description TEXT,
    alt_text TEXT,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a simple trigger function that only uses existing fields
CREATE OR REPLACE FUNCTION photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER photos_updated_at_trigger
    BEFORE UPDATE ON photos
    FOR EACH ROW
    EXECUTE FUNCTION photos_updated_at();

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create minimal RLS policies
CREATE POLICY "photos_select_policy" ON photos FOR SELECT USING (true);
CREATE POLICY "photos_insert_policy" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "photos_update_policy" ON photos FOR UPDATE USING (true);
CREATE POLICY "photos_delete_policy" ON photos FOR DELETE USING (true);

-- Grant permissions
GRANT ALL ON photos TO authenticated;
GRANT ALL ON photos TO anon;
GRANT ALL ON photos TO service_role;
