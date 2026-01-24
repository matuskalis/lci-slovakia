-- Check current photos table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- Remove any columns that might be causing issues and ensure we have the right structure
DO $$
BEGIN
  -- Drop title column if it exists (it shouldn't be there)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'title') THEN
    ALTER TABLE photos DROP COLUMN title;
  END IF;
  
  -- Ensure all required columns exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'filename') THEN
    ALTER TABLE photos ADD COLUMN filename TEXT NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'original_filename') THEN
    ALTER TABLE photos ADD COLUMN original_filename TEXT NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'storage_path') THEN
    ALTER TABLE photos ADD COLUMN storage_path TEXT NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'file_path') THEN
    ALTER TABLE photos ADD COLUMN file_path TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'public_url') THEN
    ALTER TABLE photos ADD COLUMN public_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'category') THEN
    ALTER TABLE photos ADD COLUMN category TEXT NOT NULL CHECK (category IN ('medved', 'vlk', 'rys', 'other'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'description') THEN
    ALTER TABLE photos ADD COLUMN description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'alt_text') THEN
    ALTER TABLE photos ADD COLUMN alt_text TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'file_size') THEN
    ALTER TABLE photos ADD COLUMN file_size BIGINT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'mime_type') THEN
    ALTER TABLE photos ADD COLUMN mime_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'created_at') THEN
    ALTER TABLE photos ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'photos' AND column_name = 'updated_at') THEN
    ALTER TABLE photos ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END
$$;

-- Update any existing records that might have NULL values
UPDATE photos SET created_at = NOW() WHERE created_at IS NULL;
UPDATE photos SET updated_at = NOW() WHERE updated_at IS NULL;

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;
