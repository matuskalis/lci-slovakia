-- Clear existing photos and add only the new bear photos
DELETE FROM photos;

-- Insert new bear photos with 2-word descriptions
INSERT INTO photos (
  filename,
  original_filename,
  storage_path,
  public_url,
  category,
  description,
  file_size,
  mime_type
) VALUES
('medvede-luka.jpg', '15MD.jpg', 'medved/medvede-luka.jpg', '/images/medvede-luka.jpg', 'medved', 'Medvede lúčne', 0, 'image/jpeg'),
('medviedka-trava.jpg', '18MD.jpg', 'medved/medviedka-trava.jpg', '/images/medviedka-trava.jpg', 'medved', 'Medviedka trávne', 0, 'image/jpeg'),
('medved-sediaci.jpg', '13MD.jpg', 'medved/medved-sediaci.jpg', '/images/medved-sediaci.jpg', 'medved', 'Medveď sediaci', 0, 'image/jpeg'),
('medviedka-strom.jpg', '19MD.jpg', 'medved/medviedka-strom.jpg', '/images/medviedka-strom.jpg', 'medved', 'Medviedka stromové', 0, 'image/jpeg'),
('medved-jesen.jpg', '11MD.jpg', 'medved/medved-jesen.jpg', '/images/medved-jesen.jpg', 'medved', 'Medveď jesenný', 0, 'image/jpeg'),
('medved-cesta.jpg', '14MD.jpg', 'medved/medved-cesta.jpg', '/images/medved-cesta.jpg', 'medved', 'Medveď cestný', 0, 'image/jpeg'),
('medved-pole.jpg', '6MD.jpg', 'medved/medved-pole.jpg', '/images/medved-pole.jpg', 'medved', 'Medveď poľný', 0, 'image/jpeg'),
('medviedka-pnik.jpg', 'l.jpg', 'medved/medviedka-pnik.jpg', '/images/medviedka-pnik.jpg', 'medved', 'Medviedka pníková', 0, 'image/jpeg'),
('medved-pozera.jpg', '8MD.jpg', 'medved/medved-pozera.jpg', '/images/medved-pozera.jpg', 'medved', 'Medveď pozerá', 0, 'image/jpeg');

SELECT COUNT(*) as total_photos FROM photos;
