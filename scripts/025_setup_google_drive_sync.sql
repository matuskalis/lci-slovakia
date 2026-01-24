-- Create deployment_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS deployment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    message TEXT,
    deployment_id VARCHAR(100),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_details JSONB
);

-- Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    public_url TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
    description TEXT NOT NULL,
    alt_text TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for photos
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at
    BEFORE UPDATE ON photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "deployment_logs_select_policy" ON deployment_logs;
CREATE POLICY "deployment_logs_select_policy" ON deployment_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "deployment_logs_insert_policy" ON deployment_logs;
CREATE POLICY "deployment_logs_insert_policy" ON deployment_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "deployment_logs_update_policy" ON deployment_logs;
CREATE POLICY "deployment_logs_update_policy" ON deployment_logs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "photos_select_policy" ON photos;
CREATE POLICY "photos_select_policy" ON photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "photos_insert_policy" ON photos;
CREATE POLICY "photos_insert_policy" ON photos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "photos_update_policy" ON photos;
CREATE POLICY "photos_update_policy" ON photos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "photos_delete_policy" ON photos;
CREATE POLICY "photos_delete_policy" ON photos FOR DELETE USING (true);

-- Verify tables exist
SELECT 'deployment_logs table created' as status WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'deployment_logs'
);

SELECT 'photos table created' as status WHERE EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'photos'
);

-- Show table structures
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'deployment_logs' 
ORDER BY ordinal_position;
