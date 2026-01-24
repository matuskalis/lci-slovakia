-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, published) VALUES
(
  'Ochrana medveďa hnedého na Slovensku',
  'ochrana-medveda-hnedeho-na-slovensku',
  'Medveď hnedý je najväčším predátorom žijúcim na Slovensku. Jeho ochrana je kľúčová pre zachovanie biodiverzity našich lesov. V tomto článku sa pozrieme na súčasné opatrenia na ochranu medveďa hnedého a výzvy, ktorým čelíme.

Populácia medveďa hnedého na Slovensku sa odhaduje na približne 2800-3000 jedincov. Táto populácia je jednou z najstabilnejších v Európe, ale stále čelí rôznym hrozbám.

Hlavné hrozby:
- Strata prirodzeného habitatu
- Konflikty s ľuďmi
- Nelegálne poľovníctvo
- Klimatické zmeny

Ochranné opatrenia zahŕňajú vytvorenie chránených území, vzdelávacie programy pre miestne komunity a monitoring populácie.',
  'Medveď hnedý je najväčším predátorom na Slovensku. Pozrite si súčasné ochranné opatrenia a výzvy.',
  'Dr. Mária Novotná',
  'Ochrana',
  true
),
(
  'Návrat vlka dravého do slovenských lesov',
  'navrat-vlka-draveho-do-slovenskych-lesov',
  'Vlk dravý sa po desaťročiach absencie vracia do slovenských lesov. Tento návrat prináša nové výzvy aj príležitosti pre ochranu prírody.

História vlka na Slovensku je komplikovaná. V 20. storočí bol vlk takmer vyhubený, ale v posledných rokoch pozorujeme jeho postupný návrat.

Súčasná situácia:
- Odhadovaná populácia: 150-200 jedincov
- Hlavné oblasti výskytu: Karpaty, Malé Karpaty
- Postupné šírenie na západ

Výzvy koexistencie:
- Ochrana hospodárskych zvierat
- Vzdelávanie verejnosti
- Kompenzačné mechanizmy pre pastierov

Vlk hrá dôležitú úlohu v ekosystéme ako vrcholový predátor a pomáha udržiavať rovnováhu v populáciách kopytníkov.',
  'Vlk dravý sa vracia na Slovensko. Ako môžeme zabezpečiť jeho úspešnú koexistenciu s človekom?',
  'Ing. Peter Kováč',
  'Koexistencia',
  true
),
(
  'Výskum rysa ostrovida v Karpatoch',
  'vyskum-rysa-ostrovida-v-karpatoch',
  'Rys ostrovid je najmenej známym z veľkých šeliem na Slovensku. Náš výskumný tím sleduje jeho populáciu pomocou fotopascí a GPS obojkov.

Metodológia výskumu:
- Fotopasca monitoring
- GPS telemetria
- Genetické analýzy
- Sledovanie stôp a značiek

Predbežné výsledky:
- Populácia: 80-120 jedincov
- Domovské okrsky: 50-150 km²
- Hlavná korisť: srnčia zver, zajac

Rys je veľmi plachý a skrytý, čo sťažuje jeho štúdium. Napriek tomu sa nám darí získavať cenné údaje o jeho správaní a ekológii.

Ochrana rysa je dôležitá nielen pre zachovanie druhu, ale aj pre udržanie zdravých lesných ekosystémov.',
  'Najnovšie poznatky z výskumu rysa ostrovida v slovenských Karpatoch.',
  'RNDr. Jana Svobodová',
  'Výskum',
  true
);
