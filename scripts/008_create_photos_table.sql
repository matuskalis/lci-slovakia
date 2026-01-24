-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Photos are viewable by everyone" ON photos;
DROP POLICY IF EXISTS "Authenticated users can insert photos" ON photos;
DROP POLICY IF EXISTS "Authenticated users can update photos" ON photos;
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON photos;

-- Create photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT,
  alt_text TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
CREATE INDEX IF NOT EXISTS photos_uploaded_at_idx ON photos(uploaded_at DESC);
