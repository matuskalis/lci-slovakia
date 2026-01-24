-- Optional: Add some test data to verify everything works
-- Only run this if you want sample data for testing

-- Insert some test observations (will only work if you have uploader/admin accounts)
-- Replace the user_id with actual user IDs from your auth.users table

-- First, let's see what users we have:
SELECT 
  u.id,
  u.email,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.email;

-- Insert test observations (only run this for testing)
-- Make sure you have at least one admin user first

INSERT INTO public.observations (
    title,
    species,
    location,
    date,
    time,
    photographer,
    email,
    description,
    coordinates,
    weather,
    behavior,
    image_urls,
    is_public,
    user_id
) VALUES 
(
    'Medveď hnedý v Tatrách',
    'medved',
    'Vysoké Tatry, Skalnaté pleso',
    '2024-01-15',
    '14:30:00',
    'Ján Novák',
    'jan.novak@example.com',
    'Mladý medveď hľadajúci potravu pri jazere. Pokojné správanie, neprejavoval agresivitu.',
    '49.1951, 20.0684',
    'oblacno',
    'krmenie',
    ARRAY['/placeholder.svg?height=400&width=600&text=Medveď+hnedý'],
    true,
    (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
),
(
    'Vlčia svorka v Nízkych Tatrách',
    'vlk',
    'Nízke Tatry, Chopok',
    '2024-01-10',
    '06:45:00',
    'Mária Svobodová',
    'maria.svobodova@example.com',
    'Svorka 5 vlkov pozorovaná pri love. Koordinované správanie, alfa samec viedol skupinu.',
    '48.9404, 19.5864',
    'sneh',
    'lov',
    ARRAY['/placeholder.svg?height=400&width=600&text=Vlčia+svorka'],
    true,
    (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
),
(
    'Rys ostrovid v Malej Fatre',
    'rys',
    'Malá Fatra, Vrátna dolina',
    '2024-01-08',
    '21:15:00',
    'Peter Kováč',
    'peter.kovac@example.com',
    'Samotný rys prechádzajúci cez lesný chodník. Krásne zachytené svetlo z fotopasti.',
    '49.2094, 19.0758',
    'hmla',
    'pohyb',
    ARRAY['/placeholder.svg?height=400&width=600&text=Rys+ostrovid'],
    true,
    (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
),
(
    'Medveď hnedý pri potoku',
    'medved',
    'Vysoké Tatry, Skalnaté pleso',
    '2024-01-15',
    '14:30:00',
    'Test Photographer',
    'test@example.com',
    'Mladý medveď pozorovaný pri pití vody z horského potoka. Správanie bolo pokojné.',
    '49.1951, 20.0684',
    'slnecno',
    'krmenie',
    ARRAY['/placeholder.svg?height=400&width=600&text=Bear+at+stream'],
    true,
    NULL
),
(
    'Vlčia svorka v lese',
    'vlk',
    'Nízke Tatry, Chopok',
    '2024-01-10',
    '06:45:00',
    'Wildlife Researcher',
    'researcher@example.com',
    'Svorka 4 vlkov pozorovaná pri rannom love. Alfa samec viedol skupinu.',
    '48.9414, 19.5892',
    'hmla',
    'lov',
    ARRAY['/placeholder.svg?height=400&width=600&text=Wolf+pack+hunting'],
    true,
    NULL
),
(
    'Rys ostrovid na strome',
    'rys',
    'Šumava, Boubín',
    '2024-01-08',
    '20:15:00',
    'Nature Guide',
    'guide@example.com',
    'Dospelý rys odpočívajúci na vysokom strome. Perfektné maskovanie.',
    '48.9736, 13.8047',
    'oblacno',
    'odpocinek',
    ARRAY['/placeholder.svg?height=400&width=600&text=Lynx+on+tree'],
    true,
    NULL
);

-- Verify the data was inserted correctly:
SELECT 
  id,
  title,
  species,
  location,
  photographer,
  is_public,
  created_at
FROM public.observations
ORDER BY created_at DESC;
