-- Sample data for testing
-- Run this after creating admin user

-- Insert sample observations (these will be public)
INSERT INTO observations (
  title, species, location, date, time, photographer, email, description, 
  coordinates, weather, behavior, image_urls, is_public, user_id
) VALUES 
(
  'Medveď hnedý pri potoku',
  'medved',
  'Vysoké Tatry, Skalnaté pleso',
  '2024-01-15',
  '14:30:00',
  'Ján Novák',
  'jan.novak@example.com',
  'Mladý medveď pri napájaní sa z horského potoka. Pokojné správanie, neprejavoval agresivitu.',
  '49.1951, 20.0684',
  'slnecno',
  'napajanie',
  ARRAY['/images/bear-in-meadow.jpg', '/images/bear-on-rocks.jpg'],
  true,
  NULL
),
(
  'Vlčia svorka v lese',
  'vlk',
  'Národný park Poloniny',
  '2024-01-10',
  '06:45:00',
  'Mária Svobodová',
  'maria.svobodova@example.com',
  'Svorka 5 vlkov pozorovaná pri rannom love. Alfa pár s tromi mladými jedincami.',
  '49.0614, 22.2718',
  'hmlisty',
  'lov',
  ARRAY['/images/vlk-dravy-main.jpg', '/images/vlk-dravy1.jpg'],
  true,
  NULL
),
(
  'Rys ostrovid na strome',
  'rys',
  'Nízke Tatry, Chopok',
  '2024-01-08',
  '20:15:00',
  'Peter Kováč',
  'peter.kovac@example.com',
  'Dospelý rys odpočívajúci na smrekovej vetvi. Výborná kamufláž v zimnom prostredí.',
  '48.9414, 19.5892',
  'snezenie',
  'odpocivanie',
  ARRAY['/images/rys-ostrovid-main.jpg', '/images/rys-ostrivid.jpg'],
  true,
  NULL
);

-- Insert sample photos for gallery
INSERT INTO photos (
  filename, storage_path, category, description, alt_text, 
  file_size, mime_type, public_url, uploaded_by
) VALUES 
(
  'medved-hnedy-main.jpg',
  'gallery/medved-hnedy-main.jpg',
  'medved',
  'Dospelý medveď hnedý v prirodzenom prostredí',
  'Medveď hnedý stojaci v tráve',
  245760,
  'image/jpeg',
  '/images/medved-hnedy-main.jpg',
  NULL
),
(
  'vlk-dravy-main.jpg',
  'gallery/vlk-dravy-main.jpg',
  'vlk',
  'Vlk dravý v zimnom lese',
  'Vlk dravý stojaci v snehu',
  198432,
  'image/jpeg',
  '/images/vlk-dravy-main.jpg',
  NULL
),
(
  'rys-ostrovid-main.jpg',
  'gallery/rys-ostrovid-main.jpg',
  'rys',
  'Rys ostrovid na skalnatom teréne',
  'Rys ostrovid sedí na skale',
  312896,
  'image/jpeg',
  '/images/rys-ostrovid-main.jpg',
  NULL
);
