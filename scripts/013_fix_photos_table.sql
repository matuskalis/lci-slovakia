-- Drop the existing photos table if it exists
DROP TABLE IF EXISTS photos CASCADE;

-- Create photos table with correct structure
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  public_url TEXT
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Photos are viewable by everyone" ON photos
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert photos" ON photos
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update photos" ON photos
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete photos" ON photos
FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS photos_category_idx ON photos(category);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);
