-- Add mixed wildlife photos with correct category names
INSERT INTO photos (
  filename,
  original_filename,
  storage_path,
  public_url,
  category,
  description,
  alt_text,
  file_size,
  mime_type
) VALUES
-- Additional bear photos
('medved-odpociva.jpg', 'medved-odpociva.jpg', 'medved/medved-odpociva.jpg', '/images/medved-odpociva.jpg', 'medved', 'Medveď odpočívajúci', 'Medveď hnedý odpočívajúci v tráve', 155000, 'image/jpeg'),
('medved-luka-sediaci.jpg', 'medved-luka-sediaci.jpg', 'medved/medved-luka-sediaci.jpg', '/images/medved-luka-sediaci.jpg', 'medved', 'Medveď lúkový', 'Medveď hnedý sediaci na zelenej lúke', 185000, 'image/jpeg'),

-- Wolf photos
('vlk-stojiaci.jpg', 'vlk-stojiaci.jpg', 'vlk/vlk-stojiaci.jpg', '/images/vlk-stojiaci.jpg', 'vlk', 'Vlk stojaci', 'Vlk dravý stojaci na lúke', 145000, 'image/jpeg'),
('vlk-beziaci-kaprade.jpg', 'vlk-beziaci-kaprade.jpg', 'vlk/vlk-beziaci-kaprade.jpg', '/images/vlk-beziaci-kaprade.jpg', 'vlk', 'Vlk bežiaci', 'Vlk dravý bežiaci medzi kapradinami', 160000, 'image/jpeg'),
('vlk-pozorny.jpg', 'vlk-pozorny.jpg', 'vlk/vlk-pozorny.jpg', '/images/vlk-pozorny.jpg', 'vlk', 'Vlk pozorný', 'Vlk dravý pozorne sledujúci okolie', 150000, 'image/jpeg'),

-- Lynx photos
('rys-mlady-hlavny.jpg', 'rys-mlady-hlavny.jpg', 'rys/rys-mlady-hlavny.jpg', '/images/rys-mlady-hlavny.jpg', 'rys', 'Rys mladý', 'Mladý rys ostrovid s výraznými ušnými štětcami', 135000, 'image/jpeg'),
('rys-skaly.jpg', 'rys-skaly.jpg', 'rys/rys-skaly.jpg', '/images/rys-skaly.jpg', 'rys', 'Rys skalný', 'Rys ostrovid odpočívajúci na skalách', 140000, 'image/jpeg'),
('rys-jesen.jpg', 'rys-jesen.jpg', 'rys/rys-jesen.jpg', '/images/rys-jesen.jpg', 'rys', 'Rys jesenný', 'Rys ostrovid v jesennom prostredí', 155000, 'image/jpeg'),
('rys-strom-zima.jpg', 'rys-strom-zima.jpg', 'rys/rys-strom-zima.jpg', '/images/rys-strom-zima.jpg', 'rys', 'Rys stromový', 'Rys ostrovid sediac na strome v zime', 125000, 'image/jpeg');

SELECT COUNT(*) as total_photos FROM photos;
