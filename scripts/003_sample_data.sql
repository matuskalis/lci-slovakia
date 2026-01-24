-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, author, category, published) VALUES
(
  'Návrat vlkov na Slovensko: Úspešný príbeh ochrany',
  'navrat-vlkov-na-slovensko',
  'Po desaťročiach absencie sa vlky úspešne vracajú do slovenských lesov. Sledujte ich cestu a úlohu v ekosystéme.

Vlky boli na Slovensku takmer vyhubené v 20. storočí, ale vďaka ochranárskym opatreniam sa ich populácia pomaly zotavuje. Dnes žije na Slovensku približne 400-500 jedincov, ktoré tvoria niekoľko rodinných svoriek.

Vlky hrajú kľúčovú úlohu v ekosystéme ako vrcholoví predátori. Regulujú populácie kopytníkov a pomáhajú udržiavať zdravé lesy. Ich návrat je dôkazom toho, že ochranárske úsilie môže priniesť pozitívne výsledky.

Napriek tomu čelíme výzvam v oblasti koexistencie s človekom. Pracujeme na vzdelávaní verejnosti a implementácii opatrení na minimalizáciu konfliktov.',
  'Dr. Mária Novotná',
  'Ochrana',
  true
),
(
  'Medveď hnedý: Ako žiť v súlade s najväčším európskym predátorom',
  'medved-hnedy-koexistencia',
  'Praktické rady pre obyvateľov horských oblastí o tom, ako minimalizovať konflikty s medveďmi a chrániť sa aj ich.

Medveď hnedý je najväčšou šelmou žijúcou na Slovensku. S populáciou 1200-1500 jedincov patrí medzi relatívne stabilné druhy, ale stále vyžaduje našu pozornosť a ochranu.

Koexistencia s medveďmi vyžaduje dodržiavanie základných pravidiel:
- Zabezpečenie odpadu a potravín
- Vyhýbanie sa stretnutiam v prírode
- Správne správanie pri náhodnom stretnutí
- Používanie ochranných opatrení pri včelárení a chove dobytka

Medvede sú všežravce s výbornou pamäťou. Ak raz nájdu zdroj potravy, budú sa k nemu vracať. Preto je dôležité eliminovať všetky potenciálne atraktanty v blízkosti ľudských sídiel.',
  'Ing. Peter Kováč',
  'Koexistencia',
  true
),
(
  'Rys ostrovid: Tichý lovec slovenských hôr',
  'rys-ostrovid-tichy-lovec',
  'Spoznajte tajomného rysa ostrovida, jeho správanie, životný cyklus a význam pre biodiverzitu našich lesov.

Rys ostrovid je najväčšou mačkovitou šelmou Európy a zároveň najohrozenejším druhom veľkých šeliem na Slovensku. S populáciou len 40-60 jedincov patrí medzi kriticky ohrozené druhy.

Charakteristické znaky rysa:
- Tufty na ušiach a výrazné "licúsky"
- Škvrnitá srsť s variabilným vzorom
- Krátky chvost s čiernym koncom
- Veľké labky fungujúce ako "snežnice"

Rys je samotársky lovec, ktorý preferuje nočnú aktivitu. Jeho hlavnou korisťou je srnčia zver, ale loví aj menšie cicavce a vtáky. Jeden rys potrebuje územie o rozlohe 100-400 km².

Najväčšími hrozbami pre rysa sú:
- Fragmentácia habitatu
- Nedostatok koristi
- Nelegálne zabíjanie
- Dopravné nehody

Ochrana rysa vyžaduje komplexný prístup zahŕňajúci ochranu habitatu, monitoring populácie a vzdelávanie verejnosti.',
  'RNDr. Jana Svobodová',
  'Výskum',
  true
);

-- Insert sample photos that reference your existing static images
INSERT INTO photos (filename, original_filename, storage_path, public_url, category, description, alt_text) VALUES
('medved-hnedy-main.jpg', 'medved-hnedy-main.jpg', 'medved/medved-hnedy-main.jpg', '/images/medved-hnedy-main.jpg', 'medved', 'Medveď hnedý v prirodzenom prostredí', 'Medveď hnedý stojaci v lese'),
('bear-cub-hero.jpg', 'bear-cub-hero.jpg', 'medved/bear-cub-hero.jpg', '/images/bear-cub-hero.jpg', 'medved', 'Mladé medvieďa v tráve', 'Malé medvieďa sedí v zelenej tráve'),
('bear-in-meadow.jpg', 'bear-in-meadow.jpg', 'medved/bear-in-meadow.jpg', '/images/bear-in-meadow.jpg', 'medved', 'Medveď na lúke', 'Medveď hnedý sa prechádza po lúke'),
('vlk-dravy-main.jpg', 'vlk-dravy-main.jpg', 'vlk/vlk-dravy-main.jpg', '/images/vlk-dravy-main.jpg', 'vlk', 'Vlk dravý v zimnom prostredí', 'Vlk stojaci v snehu medzi stromami'),
('vlk-dravy.jpg', 'vlk-dravy.jpg', 'vlk/vlk-dravy.jpg', '/images/vlk-dravy.jpg', 'vlk', 'Vlk v lese', 'Vlk dravý v prirodzenom lesnom prostredí'),
('vlk-dravy1.jpg', 'vlk-dravy1.jpg', 'vlk/vlk-dravy1.jpg', '/images/vlk-dravy1.jpg', 'vlk', 'Vlčia svorka', 'Skupina vlkov v lese'),
('rys-ostrovid-main.jpg', 'rys-ostrovid-main.jpg', 'rys/rys-ostrovid-main.jpg', '/images/rys-ostrovid-main.jpg', 'rys', 'Rys ostrovid na skale', 'Rys ostrovid sedí na skalnatom útvare'),
('rys-ostrivid.jpg', 'rys-ostrivid.jpg', 'rys/rys-ostrivid.jpg', '/images/rys-ostrivid.jpg', 'rys', 'Rys v prirodzenom prostredí', 'Rys ostrovid medzi kameňmi a vegetáciou'),
('rys-ostrivid2.jpg', 'rys-ostrivid2.jpg', 'rys/rys-ostrivid2.jpg', '/images/rys-ostrivid2.jpg', 'rys', 'Rys v lese', 'Rys ostrovid v lesnom prostredí');
