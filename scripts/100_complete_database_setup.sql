-- Complete Database Setup Script
-- This script creates all necessary tables and data for the LCI Slovakia app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (careful!)
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table for user authentication
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_sk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_sk TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_sk TEXT NOT NULL,
  content_en TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  author TEXT DEFAULT 'LCI Slovakia',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies (public read, admin write)
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update blog posts"
  ON blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete blog posts"
  ON blog_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title_sk, title_en, excerpt_sk, excerpt_en, content_sk, content_en, category, published_date) VALUES
(
  'ochrana-medveda-hnedeho-na-slovensku',
  'Ochrana medveďa hnedého na Slovensku',
  'Brown Bear Conservation in Slovakia',
  'Medveď hnedý je jedným z najvýznamnejších symboly slovenskej divočiny. Tento článok sa venuje úsiliu o jeho ochranu a súžitie s človekom.',
  'The brown bear is one of the most significant symbols of Slovak wilderness. This article focuses on efforts for its conservation and coexistence with humans.',
  '<p>Medveď hnedý (<em>Ursus arctos</em>) je najväčším predátorom žijúcim na Slovensku a zároveň jedným z najvýznamnejších symbolov našej divočiny. Na Slovensku žije približ 1200-1500 jedincov, čo predstavuje jednu z najväčších populácií v Európe.</p>

<h2>História ochrany</h2>
<p>Ochrana medveďa hnedého má na Slovensku dlhú tradíciu. Po období intenzívneho lovu v 19. storočí, ktorý takmer vyhubil populáciu, sa začali zavádzať ochranné opatrenia. V roku 1932 bol medveď hnedý vyhlásený za chránený druh a lov bol striktne regulovaný.</p>

<h2>Súčasná situácia</h2>
<p>Dnes je slovenská populácia medveďa hnedého relatívne stabilná, no čelí mnohým výzvam:</p>
<ul>
<li><strong>Strata biotopu:</strong> Rozširovanie ľudskej aktivity do horských oblastí znižuje dostupnosť prirodzeného prostredia.</li>
<li><strong>Konflikty s človekom:</strong> Stretnutia medveďov s ľuďmi a škody na majetku vytvárajú napätie.</li>
<li><strong>Genetická izolácia:</strong> Populácia je čiastočne izolovaná od iných európskych populácií.</li>
<li><strong>Klimatické zmeny:</strong> Ovplyvňujú dostupnosť potravy a správanie medveďov.</li>
</ul>

<h2>Ochranné opatrenia</h2>
<p>LCI Slovakia sa aktívne podieľa na ochrane medveďa hnedého prostredníctvom:</p>
<ul>
<li>Monitoringu populácie pomocou fotopascí a GPS obojkov</li>
<li>Vzdelávacej činnosti medzi miestnym obyvateľstvom</li>
<li>Zabezpečovania "medvedích" smetných košov v turistických oblastiach</li>
<li>Spolupráce s pastiermi na ochrane dobytka</li>
<li>Vytváraní koridorov pre migráciu medveďov</li>
</ul>

<h2>Ako môžete pomôcť</h2>
<p>Každý z nás môže prispieť k ochrane medveďa hnedého:</p>
<ul>
<li>Pri turistike v horách dodržiavajte pravidlá správania sa v medveďom teritóriu</li>
<li>Neponechávajte odpadky v prírode</li>
<li>Podporujte lokálnych producentov, ktorí žijú v harmónii s prírodou</li>
<li>Vzdelávajte sa a šírte informácie o správnom spolužití s veľkými šelmami</li>
</ul>

<p>Ochrana medveďa hnedého nie je len o záchrane jedného druhu – je to ochrana celého ekosystému slovenských Karpát, ktorý je domovom stoviek druhov rastlín a živočíchov. Spoločným úsilím môžeme zabezpečiť, aby medvede ostali súčasťou slovenskej prírody aj pre budúce generácie.</p>',
  '<p>The brown bear (<em>Ursus arctos</em>) is the largest predator living in Slovakia and one of the most significant symbols of our wilderness. Slovakia is home to approximately 1200-1500 individuals, representing one of the largest populations in Europe.</p>

<h2>Conservation History</h2>
<p>Brown bear conservation has a long tradition in Slovakia. After a period of intensive hunting in the 19th century that nearly wiped out the population, protective measures began to be introduced. In 1932, the brown bear was declared a protected species and hunting was strictly regulated.</p>

<h2>Current Situation</h2>
<p>Today, Slovakia''s brown bear population is relatively stable but faces many challenges:</p>
<ul>
<li><strong>Habitat loss:</strong> Expansion of human activity into mountain areas reduces availability of natural habitat.</li>
<li><strong>Human-wildlife conflict:</strong> Bear encounters with people and property damage create tension.</li>
<li><strong>Genetic isolation:</strong> The population is partially isolated from other European populations.</li>
<li><strong>Climate change:</strong> Affects food availability and bear behavior.</li>
</ul>

<h2>Conservation Measures</h2>
<p>LCI Slovakia actively participates in brown bear conservation through:</p>
<ul>
<li>Population monitoring using camera traps and GPS collars</li>
<li>Educational activities among local residents</li>
<li>Installing bear-proof garbage bins in tourist areas</li>
<li>Cooperation with shepherds on livestock protection</li>
<li>Creating corridors for bear migration</li>
</ul>

<h2>How You Can Help</h2>
<p>Each of us can contribute to brown bear conservation:</p>
<ul>
<li>Follow safety rules when hiking in bear territory</li>
<li>Don''t leave garbage in nature</li>
<li>Support local producers who live in harmony with nature</li>
<li>Educate yourself and spread information about proper coexistence with large carnivores</li>
</ul>

<p>Brown bear conservation is not just about saving one species – it''s about protecting the entire Slovak Carpathian ecosystem, which is home to hundreds of plant and animal species. Through joint efforts, we can ensure that bears remain part of Slovak nature for future generations.</p>',
  'Ochrana',
  '2024-03-15'
),
(
  'vlk-dravy-navrat-do-karpatskych-lesov',
  'Vlk dravý: Návrat do karpatských lesov',
  'Gray Wolf: Return to Carpathian Forests',
  'Po desaťročiach absencie sa vlk dravý vracia do slovenských lesov. Sledujte jeho cestu späť a význam pre ekosystém.',
  'After decades of absence, the gray wolf is returning to Slovak forests. Follow its journey back and importance for the ecosystem.',
  '<p>Vlk dravý (<em>Canis lupus</em>) je jedným z najúspešnejších príbehov návratu divočiny na Slovensko. Po takmer úplnom vyhubení v minulom storočí sa vlčia populácia postupne obnovuje a dnes na Slovensku žije približne 400-500 vlkov.</p>

<h2>Úloha vlka v ekosystéme</h2>
<p>Vlk je vrcholový predátor, ktorý zohráva kľúčovú úlohu v ekologickej rovnováhe:</p>
<ul>
<li>Reguluje populácie jelencovitej zveri</li>
<li>Odstraňuje slabé a choré jedince</li>
<li>Ovplyvňuje správanie koristi, čo vedie k regenerácii vegetácie</li>
<li>Vytvára príležitosti pre iné mäsožravce a mršinožravce</li>
</ul>

<h2>Monitoring a výskum</h2>
<p>LCI Slovakia realizuje komplexný monitoring vlčej populácie pomocou moderných technológií a metód.</p>',
  '<p>The gray wolf (<em>Canis lupus</em>) is one of the most successful wildlife return stories in Slovakia. After near-complete extermination in the last century, the wolf population is gradually recovering, and today approximately 400-500 wolves live in Slovakia.</p>

<h2>Wolf''s Role in Ecosystem</h2>
<p>The wolf is an apex predator that plays a key role in ecological balance:</p>
<ul>
<li>Regulates deer populations</li>
<li>Removes weak and sick individuals</li>
<li>Influences prey behavior, leading to vegetation regeneration</li>
<li>Creates opportunities for other carnivores and scavengers</li>
</ul>

<h2>Monitoring and Research</h2>
<p>LCI Slovakia implements comprehensive wolf population monitoring using modern technologies and methods.</p>',
  'Výskum',
  '2024-03-10'
),
(
  'rys-ostrovid-strážca-karpatskych-hor',
  'Rys ostrovid: Strážca karpatských hôr',
  'Eurasian Lynx: Guardian of Carpathian Mountains',
  'Rys ostrovid je najväčšou mačkovitou šelmou žijúcou na Slovensku. Objavte tento tajomný druh a jeho význam pre biodiverzitu.',
  'The Eurasian lynx is the largest feline predator living in Slovakia. Discover this mysterious species and its importance for biodiversity.',
  '<p>Rys ostrovid (<em>Lynx lynx</em>) je stredne veľká mačkovitá šelma, ktorá obýva karpatské lesy. Je to najväčšia mačka žijúca v Európe a na Slovensku predstavuje dôležitý článok potravového reťazca.</p>

<h2>Charakteristika</h2>
<p>Rysa možno spoznať podľa typických znakov:</p>
<ul>
<li>Štetinky na ušiach</li>
<li>Krátky chvost s čiernou špičkou</li>
<li>Sivohnedá škvrnitá srsť</li>
<li>Mohutné labky prispôsobené na pohyb v snehu</li>
</ul>

<h2>Život a potrava</h2>
<p>Rys je samotársky predátor aktívny hlavne v noci.</p>',
  '<p>The Eurasian lynx (<em>Lynx lynx</em>) is a medium-sized feline predator inhabiting Carpathian forests. It is the largest cat living in Europe and represents an important link in the food chain in Slovakia.</p>

<h2>Characteristics</h2>
<p>The lynx can be recognized by typical features:</p>
<ul>
<li>Ear tufts</li>
<li>Short tail with black tip</li>
<li>Gray-brown spotted fur</li>
<li>Large paws adapted for movement in snow</li>
</ul>

<h2>Life and Diet</h2>
<p>The lynx is a solitary predator active mainly at night.</p>',
  'Vzdelávanie',
  '2024-03-05'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: profiles, blog_posts';
  RAISE NOTICE 'Sample blog posts inserted: 3';
END $$;
