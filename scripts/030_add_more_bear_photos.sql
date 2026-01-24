-- Add more bear photos to the existing collection with correct category names
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
-- Bear photos
('medved-skaly.jpg', 'medved-skaly.jpg', 'medved/medved-skaly.jpg', '/images/medved-skaly.jpg', 'medved', 'Medveď skalný', 'Medveď hnedý odpočívajúci na machom porastených skalách', 150000, 'image/jpeg'),
('medved-breza.jpg', 'medved-breza.jpg', 'medved/medved-breza.jpg', '/images/medved-breza.jpg', 'medved', 'Medveď brezový', 'Medveď hnedý kráčajúci pri brezách', 180000, 'image/jpeg'),
('medved-stojiaci.jpg', 'medved-stojiaci.jpg', 'medved/medved-stojiaci.jpg', '/images/medved-stojiaci.jpg', 'medved', 'Medveď stojaci', 'Medveď hnedý stojaci na zadných labách na lúke', 160000, 'image/jpeg'),
('medvede-chodnik.jpg', 'medvede-chodnik.jpg', 'medved/medvede-chodnik.jpg', '/images/medvede-chodnik.jpg', 'medved', 'Medvede chodníkové', 'Medvede na lesnej ceste', 170000, 'image/jpeg'),
('medviedka-lezuci.jpg', 'medviedka-lezuci.jpg', 'medved/medviedka-lezuci.jpg', '/images/medviedka-lezuci.jpg', 'medved', 'Medviedka lezúce', 'Mladé medvieďa lezúce po strome', 140000, 'image/jpeg'),
('medved-kvety.jpg', 'medved-kvety.jpg', 'medved/medved-kvety.jpg', '/images/medved-kvety.jpg', 'medved', 'Medveď kvetový', 'Medveď hnedý na lúke s kvetmi', 190000, 'image/jpeg'),
('medved-daleko.jpg', 'medved-daleko.jpg', 'medved/medved-daleko.jpg', '/images/medved-daleko.jpg', 'medved', 'Medveď diaľkový', 'Medveď v diaľke na poli s pozorovateľňou', 200000, 'image/jpeg'),
('medviedka-stojiace.jpg', 'medviedka-stojiace.jpg', 'medved/medviedka-stojiace.jpg', '/images/medviedka-stojiace.jpg', 'medved', 'Medviedka stojace', 'Mladé medvieďa stojace pri strome', 130000, 'image/jpeg'),
('medved-kaprade.jpg', 'medved-kaprade.jpg', 'medved/medved-kaprade.jpg', '/images/medved-kaprade.jpg', 'medved', 'Medveď kapradinový', 'Medveď hnedý medzi kapradinami', 175000, 'image/jpeg'),
('medved-kmen.jpg', 'medved-kmen.jpg', 'medved/medved-kmen.jpg', '/images/medved-kmen.jpg', 'medved', 'Medveď kmeňový', 'Medveď hnedý pri mŕtvom kmeni stromu', 165000, 'image/jpeg');

SELECT COUNT(*) as total_photos FROM photos;
