-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
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
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to published posts" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Allow admin full access" ON blog_posts
    FOR ALL USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, published) VALUES
(
    'Ochrana medveďa hnedého na Slovensku',
    'ochrana-medveda-hnedeho-na-slovensku',
    'Medveď hnedý je najväčším predátorom žijúcim na Slovensku. Jeho ochrana je kľúčová pre zachovanie biodiverzity našich lesov. V tomto článku sa pozrieme na súčasné opatrenia na ochranu medveďa hnedého a výzvy, ktorým čelíme pri jeho ochrane.',
    'Pozrite si súčasné opatrenia na ochranu medveďa hnedého na Slovensku a výzvy ochrany.',
    'LCI Team',
    'Ochrana',
    true
),
(
    'Koexistencia človeka a veľkých šeliem',
    'koexistencia-cloveka-a-velkych-seliem',
    'Koexistencia človeka s veľkými šelmami je jednou z najväčších výziev modernej ochrany prírody. Tento článok sa zaoberá stratégiami a riešeniami, ktoré umožňují pokojné spolužitie ľudí s medveďmi, vlkmi a rysmi.',
    'Stratégie a riešenia pre pokojné spolužitie ľudí s veľkými šelmami.',
    'Dr. Mária Novák',
    'Koexistencia',
    true
),
(
    'Najnovší výskum populácie rysa ostrovida',
    'najnovsi-vyskum-populacie-rysa-ostrovida',
    'Rys ostrovid je najmenej početnou veľkou šelmou na Slovensku. Najnovší výskum ukazuje pozitívne trendy v jeho populácii, ale stále čelí mnohým hrozbám. Prečítajte si o najnovších zisteniach vedcov.',
    'Najnovšie zistenia o populácii rysa ostrovida na Slovensku.',
    'Prof. Ján Kováč',
    'Výskum',
    false
);
