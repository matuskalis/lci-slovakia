-- Fix blog_posts table schema to match code expectations
DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_sk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_sk TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_sk TEXT NOT NULL,
  content_en TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON blog_posts FOR ALL USING (true);

-- Insert bilingual blog posts
INSERT INTO blog_posts (slug, title_sk, title_en, excerpt_sk, excerpt_en, content_sk, content_en, category, image_url, published_date)
VALUES 
(
  'ochrana-medveda-hnedeho-na-slovensku',
  'Ochrana medveďa hnedého na Slovensku',
  'Brown Bear Protection in Slovakia',
  'Medveď hnedý je najväčšou európskou šelmou a na Slovensku patrí medzi chránené druhy.',
  'The brown bear is Europe''s largest predator and is protected in Slovakia.',
  '<h2>Úvod</h2><p>Medveď hnedý (Ursus arctos) žije približne 1200-1500 jedincov na Slovensku.</p><h2>Životný priestor</h2><p>Medvede preferujú rozsiahle lesné komplexy.</p>',
  '<h2>Introduction</h2><p>The brown bear (Ursus arctos) - Slovakia is home to approximately 1200-1500 individuals.</p><h2>Habitat</h2><p>Bears prefer extensive forest complexes.</p>',
  'Ochrana',
  '/placeholder.svg?height=600&width=1200',
  NOW() - INTERVAL '7 days'
),
(
  'vlk-dravy-navrat-do-slovenskych-lesov',
  'Vlk dravý: Návrat do slovenských lesov',
  'Gray Wolf: Return to Slovak Forests',
  'Po desaťročiach absencie sa vlk dravý vracia do našej prírody.',
  'After decades of absence, the gray wolf is returning to our nature.',
  '<h2>História</h2><p>Vlk dravý (Canis lupus) bol v minulosti takmer vyhubený.</p>',
  '<h2>History</h2><p>The gray wolf (Canis lupus) was nearly exterminated in the past.</p>',
  'Ochrana',
  '/placeholder.svg?height=600&width=1200',
  NOW() - INTERVAL '14 days'
),
(
  'rys-ostrovid-ticha-sila-karpat',
  'Rys ostrovid: Tichá sila Karpát',
  'Eurasian Lynx: Silent Power of the Carpathians',
  'Rys ostrovid je tajomným obyvateľom našich hôr.',
  'The Eurasian lynx is a mysterious inhabitant of our mountains.',
  '<h2>Charakteristika</h2><p>Rys ostrovid (Lynx lynx) žije 300-400 jedincov na Slovensku.</p>',
  '<h2>Characteristics</h2><p>The Eurasian lynx (Lynx lynx) - Slovakia hosts 300-400 individuals.</p>',
  'Ochrana',
  '/placeholder.svg?height=600&width=1200',
  NOW() - INTERVAL '21 days'
),
(
  'ako-spolunazvat-s-velkymi-selmami',
  'Ako spolunažívať s veľkými šelmami',
  'How to Coexist with Large Carnivores',
  'Praktické rady pre život v oblastiach, kde žijú medvede, vlky a rysy.',
  'Practical tips for living in areas where bears, wolves and lynxes are present.',
  '<h2>Základné pravidlá</h2><p>Pri pohybe v prírode je dôležité robiť hluk.</p>',
  '<h2>Basic Rules</h2><p>When moving through nature, it is important to make noise.</p>',
  'Koexistencia',
  '/placeholder.svg?height=600&width=1200',
  NOW() - INTERVAL '3 days'
);

-- Clear and refill photos table
DELETE FROM photos;

INSERT INTO photos (filename, original_filename, storage_path, public_url, category, description, alt_text) VALUES
('medved-1.jpg', 'brown-bear-slovakia.jpg', 'photos/medved-1.jpg', '/placeholder.svg?height=800&width=1200', 'medved', 'Medveď hnedý v prírodnom prostredí slovenských hôr', 'Medveď hnedý v lese'),
('medved-2.jpg', 'bear-forest.jpg', 'photos/medved-2.jpg', '/placeholder.svg?height=800&width=1200', 'medved', 'Medveď prechádzajúci lesom na jar', 'Medveď v jarnom lese'),
('medved-3.jpg', 'bear-cubs.jpg', 'photos/medved-3.jpg', '/placeholder.svg?height=800&width=1200', 'medved', 'Medvedia rodina v Tatrách', 'Medvedica s mláďatami'),
('medved-4.jpg', 'bear-stream.jpg', 'photos/medved-4.jpg', '/placeholder.svg?height=800&width=1200', 'medved', 'Medveď pri horskom potoku', 'Medveď pije z potoka'),
('medved-5.jpg', 'bear-autumn.jpg', 'photos/medved-5.jpg', '/placeholder.svg?height=800&width=1200', 'medved', 'Medveď hľadajúci potravu na jeseň', 'Medveď v jesennom lese'),
('vlk-1.jpg', 'gray-wolf-carpathians.jpg', 'photos/vlk-1.jpg', '/placeholder.svg?height=800&width=1200', 'vlk', 'Vlk dravý v karpatských lesoch', 'Vlk v Karpatoch'),
('vlk-2.jpg', 'wolf-pack.jpg', 'photos/vlk-2.jpg', '/placeholder.svg?height=800&width=1200', 'vlk', 'Vlčia svorka v zimnom období', 'Vlčia svorka v zime'),
('vlk-3.jpg', 'wolf-howling.jpg', 'photos/vlk-3.jpg', '/placeholder.svg?height=800&width=1200', 'vlk', 'Vlk zavýjajúci za súmraku', 'Zavýjajúci vlk'),
('vlk-4.jpg', 'wolf-portrait.jpg', 'photos/vlk-4.jpg', '/placeholder.svg?height=800&width=1200', 'vlk', 'Portrét vlka dravého', 'Portrét vlka'),
('vlk-5.jpg', 'wolf-forest.jpg', 'photos/vlk-5.jpg', '/placeholder.svg?height=800&width=1200', 'vlk', 'Vlk prechádzajúci hmlou v lese', 'Vlk v hmlistom lese'),
('rys-1.jpg', 'eurasian-lynx.jpg', 'photos/rys-1.jpg', '/placeholder.svg?height=800&width=1200', 'rys', 'Rys ostrovid v snehovej pokrývke', 'Rys v snehu'),
('rys-2.jpg', 'lynx-hunting.jpg', 'photos/rys-2.jpg', '/placeholder.svg?height=800&width=1200', 'rys', 'Rys počas lovu v tatranskom lese', 'Rys pri love'),
('rys-3.jpg', 'lynx-portrait.jpg', 'photos/rys-3.jpg', '/placeholder.svg?height=800&width=1200', 'rys', 'Portrét rysa ostrovida', 'Portrét rysa'),
('rys-4.jpg', 'lynx-tree.jpg', 'photos/rys-4.jpg', '/placeholder.svg?height=800&width=1200', 'rys', 'Rys na strome', 'Rys šplhajúci na strom'),
('rys-5.jpg', 'lynx-kitten.jpg', 'photos/rys-5.jpg', '/placeholder.svg?height=800&width=1200', 'rys', 'Mláďa rysa ostrovida', 'Mláďa rysa'),
('other-1.jpg', 'deer-mountains.jpg', 'photos/other-1.jpg', '/placeholder.svg?height=800&width=1200', 'other', 'Jeleň lesný v slovenských horách', 'Jeleň v horách'),
('other-2.jpg', 'forest-landscape.jpg', 'photos/other-2.jpg', '/placeholder.svg?height=800&width=1200', 'other', 'Slovenský prales', 'Prales na Slovensku');
