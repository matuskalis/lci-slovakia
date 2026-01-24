-- Fix photos table category constraint
-- This script updates the photos table to use correct category values

-- First, let's see what categories currently exist
SELECT DISTINCT category FROM photos;

-- Drop the existing constraint if it exists
ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_category_check;

-- Add the new constraint with correct values
ALTER TABLE photos ADD CONSTRAINT photos_category_check 
CHECK (category IN ('medved', 'vlk', 'rys', 'other'));

-- Update any existing incorrect category values
UPDATE photos SET category = 'medved' WHERE category IN ('medved-hnedy', 'bear', 'medveď', 'medved_hnedy');
UPDATE photos SET category = 'vlk' WHERE category IN ('vlk-dravy', 'wolf', 'vlk_dravy');
UPDATE photos SET category = 'rys' WHERE category IN ('rys-ostrovid', 'lynx', 'rys_ostrovid');
UPDATE photos SET category = 'other' WHERE category NOT IN ('medved', 'vlk', 'rys');

-- Verify the results
SELECT category, COUNT(*) as count FROM photos GROUP BY category ORDER BY category;

-- Show the constraint
SELECT conname, consrc FROM pg_constraint WHERE conname = 'photos_category_check';
