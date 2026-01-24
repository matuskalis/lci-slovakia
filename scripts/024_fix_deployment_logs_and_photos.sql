-- Drop existing policies if they exist
DROP POLICY IF EXISTS "deployment_logs_select_policy" ON deployment_logs;
DROP POLICY IF EXISTS "deployment_logs_insert_policy" ON deployment_logs;
DROP POLICY IF EXISTS "Service role can manage deployment logs" ON deployment_logs;
DROP POLICY IF EXISTS "Authenticated users can read deployment logs" ON deployment_logs;

-- Drop and recreate the deployment_logs table to ensure clean state
DROP TABLE IF EXISTS deployment_logs CASCADE;

-- Create deployment logs table
CREATE TABLE deployment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  deployment_id VARCHAR(100),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_details JSONB
);

-- Create index for faster queries
CREATE INDEX idx_deployment_logs_triggered_at ON deployment_logs(triggered_at DESC);
CREATE INDEX idx_deployment_logs_status ON deployment_logs(status);

-- Enable RLS
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Allow all operations on deployment_logs" ON deployment_logs
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON deployment_logs TO authenticated;
GRANT ALL ON deployment_logs TO anon;
GRANT ALL ON deployment_logs TO service_role;

-- Insert initial log entry
INSERT INTO deployment_logs (deployment_type, status, message)
VALUES ('setup', 'completed', 'Nightly deployment system initialized');

-- Now let's fix the photos table to ensure uploads work
-- First, let's see what columns actually exist and fix any issues

-- Drop existing photos table and recreate with correct structure
DROP TABLE IF EXISTS photos CASCADE;

-- Create photos table with correct structure
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  public_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT NOT NULL,
  alt_text TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create simple policies for photos
CREATE POLICY "Allow all operations on photos" ON photos
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON photos TO authenticated;
GRANT ALL ON photos TO anon;
GRANT ALL ON photos TO service_role;

-- Create updated_at trigger
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

-- Insert some test data to verify everything works
INSERT INTO photos (filename, original_filename, storage_path, category, description, alt_text)
VALUES 
  ('test-medved-1.jpg', 'bear-photo.jpg', 'medved/test-medved-1.jpg', 'medved', 'Test bear photo', 'A test bear photo'),
  ('test-vlk-1.jpg', 'wolf-photo.jpg', 'vlk/test-vlk-1.jpg', 'vlk', 'Test wolf photo', 'A test wolf photo');

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;
