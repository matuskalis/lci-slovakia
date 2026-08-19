# TODO

Otvorené úlohy na webe LCI. Stav k 19. augustu 2026.
Blokery, ktoré čakajú výhradne na obsah od LCI, sú v `CONTENT_GAPS.md` na branchi
`redesign/carpathian-evidence`; tento súbor je pracovný zoznam Matúša.

## 1. Fotogaléria a kredity

Galéria dnes nezobrazuje nič, lebo číta Supabase tabuľku `photos`, ktorá
v projekte `nopcnmwqmadkoyurlooz` neexistuje.

- [ ] Vytvoriť tabuľku `photos` v aktuálnom Supabase projekte a nastaviť GRANTy
      pre `service_role` (bez nich admin skripty ticho zapíšu nula riadkov)
- [ ] Doplniť do Vercelu env premenné pre Supabase, inak `/galeria`,
      `/galeria/[category]` a `/galeria/foto/[id]` zostanú prázdne
- [ ] Nahrať fotky cez `/admin/upload`
- [ ] Ku každej fotke vyplniť autora. Pole `author` už v type existuje
      (`lib/supabase-config.ts:51`), ale **žiadna stránka galérie ho dnes
      nevykresľuje** — treba doplniť kredit do dlaždice aj do detailu fotky
- [ ] Bez doloženého autora sa fotka nezverejňuje. Týka sa to aj 68 obrázkov
      v `public/images` (bod 9 v `CONTENT_GAPS.md`)

## 2. Mapa: nahradiť aktuality zo sprejnamedveda.sk

Mapa ťahá 504 udalostí z `/data/bear-activities.json` (zdroj `sprejnamedveda.sk`),
z toho 160 za rok 2025. Sú to markery navyše popri dátach z Lesov SR:
586 + 160 = 746 markerov, ktoré mapa dnes kreslí pre rok 2025.

- [ ] Vyhodiť feed zo `sprejnamedveda.sk` (pôvod a licencia nie sú doložené,
      bod 19 v `CONTENT_GAPS.md`)
- [ ] **Otvorená otázka:** čím presne ho nahradiť. Treba doplniť názov zdroja,
      URL a formát dát, potom sa dá napojiť.

## 3. /o-nas: prepísať históriu združenia

Časová os na `/o-nas` je dnes generický text bez doloženia
(`contexts/LanguageContext.tsx:147-158`, SK aj EN verzia):

- `2020 Založenie združenia`
- `2021 Prvé projekty` — hlavne tento treba prepísať
- `2023 Medzinárodná spolupráca`
- `2025 Súčasnosť` — "uznávaná organizácia" je tvrdenie, ktoré nemáme čím podložiť

- [ ] Vypýtať si od LCI skutočné znenie: čo sa v ktorom roku naozaj stalo,
      s dátumami a názvami projektov
- [ ] Prepísať aj úvodný text o združení podľa toho, čo dodajú
- [ ] Kým podklady neprídu, nenahrádzať to inou pravdepodobne znejúcou výplňou

## 4. Dozvuky po otvorení dát (hotové 19. 8. 2026, zostáva dočistiť)

- [ ] Zrušiť nepoužívané env premenné vo Verceli: `RESEND_API_KEY`,
      `DATA_REQUEST_FROM`, `DATA_REQUEST_SECRET`
- [ ] Rozhodnúť, čo s tabuľkou `data_requests` v Supabase. Zostala aj so
      záznamami o doterajších žiadateľoch; kód ju už nepoužíva
- [ ] Overiť s Lesmi SR licenciu na ďalšie šírenie datasetu. Web pred zmenou
      tvrdil, že dáta sa nesmú zverejňovať bez ich súhlasu, a bod 6
      v `CONTENT_GAPS.md` je stále otvorený
