-- Add new wildlife photos to the database
-- Run this script to insert the new photos into the photos table

-- Insert lynx photos
INSERT INTO photos (
  filename,
  original_filename,
  storage_path,
  public_url,
  category,
  description,
  alt_text,
  file_size,
  mime_type,
  created_at,
  updated_at
) VALUES
-- Lynx photos
(
  'rys-v-lese.jpg',
  'rys_ostrovid.jpg',
  'rys/rys-v-lese.jpg',
  '/images/rys-v-lese.jpg',
  'rys',
  'Rys lesný',
  'Rys ostrovid stojaci v lesnom prostredí medzi vetvami',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'rys-mlady.jpg',
  'rys_ostrovid_main.jpg',
  'rys/rys-mlady.jpg',
  '/images/rys-mlady.jpg',
  'rys',
  'Mladý rys',
  'Mladý rys ostrovid kráčajúci lesom',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'rys-na-strome.jpg',
  'rys_ostrivid2.jpeg',
  'rys/rys-na-strome.jpg',
  '/images/rys-na-strome.jpg',
  'rys',
  'Rys stromový',
  'Rys ostrovid sedí na vetvách stromu v zime',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'rys-na-skale.jpg',
  'rys_ostrivid.jpg',
  'rys/rys-na-skale.jpg',
  '/images/rys-na-skale.jpg',
  'rys',
  'Rys skalný',
  'Rys ostrovid odpočívajúci na skalnom výbežku',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),

-- Bear photos
(
  'medved-na-strome.jpg',
  '9.jpg',
  'medved/medved-na-strome.jpg',
  '/images/medved-na-strome.jpg',
  'medved',
  'Medveď stromový',
  'Medveď hnedý lezúci na veľkom kmeni stromu v lese',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'medvede-na-ceste.jpg',
  '10.jpg',
  'medved/medvede-na-ceste.jpg',
  '/images/medvede-na-ceste.jpg',
  'medved',
  'Medvede cestné',
  'Medvedíča na lesnej ceste s dospelým medveďom v pozadí',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'medved-v-krajine.jpg',
  '20MD.jpg',
  'medved/medved-v-krajine.jpg',
  '/images/medved-v-krajine.jpg',
  'medved',
  'Medveď krajinný',
  'Medveď hnedý na otvorenom poli s pozorovateľňou a hmlistým lesom',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),

-- Wolf photos
(
  'vlk-v-lese.jpg',
  'vlk_dravy.jpg',
  'vlk/vlk-v-lese.jpg',
  '/images/vlk-v-lese.jpg',
  'vlk',
  'Vlk lesný',
  'Vlk dravý stojaci v lesnej čistine medzi papraďami',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'vlk-na-luke.jpg',
  'vlk_dravy1.jpg',
  'vlk/vlk-na-luke.jpg',
  '/images/vlk-na-luke.jpg',
  'vlk',
  'Vlk lúčny',
  'Vlk dravý stojaci na otvorenej lúke',
  0,
  'image/jpeg',
  NOW(),
  NOW()
),
(
  'vlk-beziaci.jpg',
  'vlk-dravy2.jpg',
  'vlk/vlk-beziaci.jpg',
  '/images/vlk-beziaci.jpg',
  'vlk',
  'Vlk bežiaci',
  'Vlk dravý bežiaci lesom s otvorenou papuľou',
  0,
  'image/jpeg',
  NOW(),
  NOW()
);

-- Verify the insertions
SELECT 
  category,
  COUNT(*) as photo_count,
  STRING_AGG(description, ', ') as descriptions
FROM photos 
WHERE created_at >= CURRENT_DATE
GROUP BY category
ORDER BY category;

-- Show all photos by category
SELECT 
  id,
  filename,
  category,
  description,
  created_at
FROM photos 
ORDER BY category, created_at DESC;
