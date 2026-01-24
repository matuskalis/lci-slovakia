-- Verify photos table schema and fix any issues
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- Check if photos table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'photos'
);

-- Update any NULL created_at values to current timestamp
UPDATE photos SET created_at = NOW() WHERE created_at IS NULL;

-- Ensure all required columns exist
DO $$
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'alt_text') THEN
    ALTER TABLE photos ADD COLUMN alt_text TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'file_size') THEN
    ALTER TABLE photos ADD COLUMN file_size BIGINT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'mime_type') THEN
    ALTER TABLE photos ADD COLUMN mime_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'public_url') THEN
    ALTER TABLE photos ADD COLUMN public_url TEXT;
  END IF;
END
$$;
