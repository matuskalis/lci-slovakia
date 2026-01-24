-- Simple blog posts table for bilingual content
CREATE TABLE IF NOT EXISTS blog_posts (
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

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON blog_posts
  FOR SELECT USING (true);

-- Allow insert/update/delete (will be controlled by admin password check in app)
CREATE POLICY "Admin full access" ON blog_posts
  FOR ALL USING (true);

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title_sk, title_en, excerpt_sk, excerpt_en, content_sk, content_en, category, published_date)
VALUES 
(
  'ochrana-medveda-hnedeho-na-slovensku',
  'Ochrana medveďa hnedého na Slovensku',
  'Brown Bear Protection in Slovakia',
  'Medveď hnedý je najväčším európskym šelmou a na Slovensku patrí medzi chránené druhy. Poznajte jeho život a význam ochrany.',
  'The brown bear is Europe''s largest predator and is protected in Slovakia. Learn about its life and conservation importance.',
  '<h2>Úvod</h2><p>Medveď hnedý (Ursus arctos) je symbolom našich hôr a lesov. Na Slovensku žije približne 1200-1500 jedincov, prevažne v karpatských pohoriach.</p><h2>Životný priestor</h2><p>Medvede preferujú rozsiahle lesné komplexy s dostatkom potravy a úkrytov. Potrebujú veľké územia - domovský okrsok samca môže mať až 1000 km².</p><h2>Ochrana</h2><p>Medveď hnedý patrí medzi kriticky ohrozené druhy. Jeho ochrana zahŕňa vytvorenie chránených území, ekologických koridorov a osvetu verejnosti o správnom správaní v medvedích územiach.</p>',
  '<h2>Introduction</h2><p>The brown bear (Ursus arctos) is a symbol of our mountains and forests. Slovakia is home to approximately 1200-1500 individuals, mainly in the Carpathian mountain ranges.</p><h2>Habitat</h2><p>Bears prefer extensive forest complexes with sufficient food and shelter. They require large territories - a male''s home range can span up to 1000 km².</p><h2>Conservation</h2><p>The brown bear is critically endangered. Its protection includes creating protected areas, ecological corridors, and public education about proper behavior in bear territories.</p>',
  'Ochrana',
  NOW() - INTERVAL '7 days'
),
(
  'vlk-dravy-navrat-do-slovenskych-lesov',
  'Vlk dravý: Návrat do slovenských lesov',
  'Gray Wolf: Return to Slovak Forests',
  'Po desaťročiach absencie sa vlk dravý vracia do našej prírody. Jeho prítomnosť je kľúčová pre zdravie ekosystémov.',
  'After decades of absence, the gray wolf is returning to our nature. Its presence is crucial for ecosystem health.',
  '<h2>História</h2><p>Vlk dravý (Canis lupus) bol v minulosti takmer vyhubený. Vďaka ochranárskym opatreniam sa jeho populácia postupne obnovuje.</p><h2>Význam v ekosystéme</h2><p>Vlky regulujú populácie kopytníkov a pomáhajú udržiavať zdravie lesov. Sú vrcholovým predátorom a ich prítomnosť signalizuje zdravý ekosystém.</p><h2>Spolunažívanie</h2><p>Moderná ochrana zahŕňa kompenzačné programy pre pastierov a osvetu o tom, ako minimalizovať konflikty medzi ľuďmi a vlkmi.</p>',
  '<h2>History</h2><p>The gray wolf (Canis lupus) was nearly exterminated in the past. Thanks to conservation efforts, its population is gradually recovering.</p><h2>Ecosystem Role</h2><p>Wolves regulate ungulate populations and help maintain forest health. They are apex predators and their presence signals a healthy ecosystem.</p><h2>Coexistence</h2><p>Modern conservation includes compensation programs for shepherds and education on minimizing human-wolf conflicts.</p>',
  'Ochrana',
  NOW() - INTERVAL '14 days'
),
(
  'rys-ostrovid-ticha-sila-karpat',
  'Rys ostrovid: Tichá sila Karpát',
  'Eurasian Lynx: Silent Power of the Carpathians',
  'Rys ostrovid je tajomným obyvateľom našich hôr. Jeho ochrana je dôležitá pre zachovanie biodiverzity.',
  'The Eurasian lynx is a mysterious inhabitant of our mountains. Its protection is vital for biodiversity.',
  '<h2>Charakteristika</h2><p>Rys ostrovid (Lynx lynx) je stredne veľká mačkovitá šelma s charakteristickými štetinami na ušiach. Na Slovensku žije 300-400 jedincov.</p><h2>Spôsob života</h2><p>Rysy sú samotárske a teritoriálne zvieratá. Loví hlavne malé až stredne veľké cicavce, najmä srnčiu zver.</p><h2>Ochranné opatrenia</h2><p>Ochrana rysa zahŕňa monitoring populácie, ochranu habitatu a znižovanie fragmentácie krajiny. Dôležitá je aj podpora ekologických koridorov pre spojenie izolovaných populácií.</p>',
  '<h2>Characteristics</h2><p>The Eurasian lynx (Lynx lynx) is a medium-sized feline with characteristic ear tufts. Slovakia hosts 300-400 individuals.</p><h2>Lifestyle</h2><p>Lynxes are solitary and territorial animals. They hunt mainly small to medium-sized mammals, especially roe deer.</p><h2>Conservation Measures</h2><p>Lynx protection includes population monitoring, habitat protection, and reducing landscape fragmentation. Supporting ecological corridors to connect isolated populations is also important.</p>',
  'Ochrana',
  NOW() - INTERVAL '21 days'
);
