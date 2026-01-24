"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "sk" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  sk: {
    // Navigation
    "nav.home": "Domov",
    "nav.about": "O nás",
    "nav.species": "Šelmy",
    "nav.map": "Mapa",
    "nav.blog": "Blog",
    "nav.gallery": "Galéria",
    "nav.cooperation": "Spolupráce",
    "nav.login": "Prihlásiť sa",
    "nav.register": "Registrovať sa",
    "nav.all-species": "Všetky šelmy",

    // Species
    "species.bear": "Medveď hnedý",
    "species.wolf": "Vlk dravý",
    "species.lynx": "Rys ostrovid",

    // Species descriptions
    "species.bear.description": "Najväčšia šelma Slovenska, všežravec s impozantnou postavou a neuveriteľnou silou.",
    "species.wolf.description": "Inteligentný a sociálny predátor žijúci v rodinných svorách s komplexnou hierarchiou.",
    "species.lynx.description":
      "Najväčšia mačkovitá šelma Európy s charakteristickými ušnými štetkami a dokonalým nočným zrakom.",

    // Species populations
    "species.bear.population": "1200-1500 jedincov",
    "species.wolf.population": "400-500 jedincov",
    "species.lynx.population": "40-60 jedincov",

    // Species status
    "species.bear.status": "Stabilná populácia",
    "species.wolf.status": "Chránený",
    "species.lynx.status": "Kriticky ohrozený",

    // Homepage
    "hero.title": "Ochrana veľkých šeliem na Slovensku",
    "hero.subtitle": "Venujeme sa výskumu a ochrane medveďa, vlka a rysa v ich prirodzenom prostredí",
    "hero.cta1": "Spoznaj naše šelmy",
    "hero.cta2": "O našej práci",

    // Stats
    "stats.species": "Druhy šeliem",
    "stats.research": "Rokov výskumu",
    "stats.observations": "Pozorovaní",

    // Mission
    "mission.title": "Naša misia",
    "mission.description":
      "LCI-SK.eu je združenie odborníkov a nadšencov, ktorí sa venujú ochrane a výskumu veľkých šeliem na Slovensku. Naším cieľom je zabezpečiť dlhodobé prežitie medveďa hnedého, vlka dravého a rysa ostrovida v slovenských lesoch.",
    "mission.research": "Výskum",
    "mission.research.desc": "Sledujeme populácie a správanie veľkých šeliem pomocou najmodernejších technológií",
    "mission.protection": "Ochrana",
    "mission.protection.desc": "Chránime ich prirodzené prostredie a migračné koridory pre budúce generácie",
    "mission.education": "Osveta",
    "mission.education.desc": "Vzdelávame verejnosť o význame týchto druhov pre ekosystém",

    // Species section
    "species.title": "Naše šelmy",
    "species.subtitle":
      "Spoznajte tri najväčšie šelmy Slovenska a dozviete sa o ich živote, správaní a výzvach, ktorým čelia v modernom svete.",
    "species.learn-more": "Zistiť viac",

    // Gallery
    "gallery.title": "Fotogaléria",
    "gallery.subtitle": "Objavte úžasné zábery veľkých šeliem v ich prirodzenom prostredí",
    "gallery.bear.standing": "Medveď na zadných nohách",
    "gallery.bear.standing.desc": "Mladý medveď sa postavil na zadné nohy",
    "gallery.bear.forest": "Medveď medzi papraďami",
    "gallery.bear.forest.desc": "Dospelý medveď hľadá potravu",
    "gallery.bear.resting": "Odpočívajúci medveď",
    "gallery.bear.resting.desc": "Medveď si odpočíva na lúke",
    "gallery.bear.alert": "Pozorný medveď",
    "gallery.bear.alert.desc": "Medveď sedí a pozoruje okolie",
    "gallery.wolf.winter": "Vlk v zime",
    "gallery.wolf.winter.desc": "Vlk v zimnom prostredí",
    "gallery.lynx.forest": "Rys v lese",
    "gallery.lynx.forest.desc": "Rys ostrovid vo svojom prirodzenom prostredí",
    "gallery.no.photos": "Žiadne fotografie",
    "gallery.no.photos.desc": "Zatiaľ neboli nahrané žiadne fotografie do galérie.",
    "gallery.no.results.desc": "Skúste zmeniť filtre alebo vyhľadávací výraz",
    "gallery.no.photos.in.category": "Žiadne fotografie v tejto kategórii.",

    // Blog
    "blog.title": "Najnovšie z blogu",
    "blog.subtitle": "Sledujte naše najnovšie objavy, výskumné projekty a príbehy zo sveta veľkých šeliem.",
    "blog.all-articles": "Všetky články",
    "blog.post1.title": "Nové pozorovania medveďa v Tatrách",
    "blog.post1.excerpt":
      "Výskumníci zaznamenali zvýšenú aktivitu medveďa hnedého v oblasti Vysokých Tatier. Najnovšie údaje ukazujú pozitívny trend...",
    "blog.post2.title": "Vlčia svorka v Malých Karpatoch",
    "blog.post2.excerpt":
      "Po dlhých rokoch sa vlci vrátili do oblasti Malých Karpát, kde boli naposledy pozorovaní pred desiatkami rokov...",
    "blog.post3.title": "Rysie zimovanie a jeho význam",
    "blog.post3.excerpt":
      "Zimné správanie rysa je fascinujúci proces, ktorý im umožňuje prežiť chladné mesiace v horskom prostredí...",
    "blog.category.research": "Výskum",
    "blog.category.protection": "Ochrana",
    "blog.category.education": "Vzdelávanie",

    // CTA
    "cta.title": "Pomôžte nám chrániť šelmy",
    "cta.description":
      "Vaša podpora je kľúčová pre úspech našich projektov. Pridajte sa k nám a pomôžte zachovať tieto úžasné druhy pre budúce generácie.",
    "cta.support": "Podporiť projekt",

    // Footer
    "footer.partners": "Naši partneri",
    "footer.quick-links": "Rýchle odkazy",
    "footer.contact": "Kontakt",
    "footer.rights": "Všetky práva vyhradené.",

    // Map
    "map.title": "Mapa Slovenska",
    "map.subtitle": "Interaktívna mapa pozorovaní veľkých šeliem na území Slovenskej republiky",
    "map.legend.confirmed": "Potvrdené pozorovanie",
    "map.legend.signs": "Pobytové znaky",
    "map.legend.conflict": "Zaznamenaný stret",

    // About
    "about.title": "O združení LCI-SK",
    "about.subtitle": "Sme tím odborníkov a nadšencov venujúcich sa ochrane veľkých šeliem",
    "about.mission.title": "Naša misia",
    "about.mission.description":
      "Združenie LCI-SK.eu vzniklo z potreby systematickej ochrany a výskumu veľkých šeliem na Slovensku. Naším hlavným cieľom je zabezpečiť dlhodobé prežitie medveďa hnedého, vlka dravého a rysa ostrovida v ich prirodzenom prostredí prostredníctvom vedeckého výskumu, ochrany prostredia a vzdelávania verejnosti.",
    "about.team": "Náš tím",
    "about.team.description":
      "Sme skupina odborníkov z rôznych oblastí, ktorých spája láska k prírode a záujem o ochranu veľkých šeliem.",
    "about.history": "História združenia",
    "about.goals": "Naše ciele",
    "about.history.2020.title": "Založenie združenia",
    "about.history.2020.desc":
      "Skupina nadšencov a ochranárov sa rozhodla založiť združenie zamerané na systematický výskum a ochranu veľkých šeliem na Slovensku.",
    "about.history.2021.title": "Prvé projekty",
    "about.history.2021.desc":
      "Spustili sme prvé výskumné projekty zamerané na monitoring populácií a mapovanie výskytu veľkých šeliem v slovenských lesoch.",
    "about.history.2023.title": "Medzinárodná spolupráca",
    "about.history.2023.desc":
      "Nadviazali sme spoluprácu s výskumnými inštitúciami v susedných krajinách a začali koordinované projekty ochrany.",
    "about.history.2025.title": "Súčasnosť",
    "about.history.2025.desc":
      "Dnes sme uznávanou organizáciou v oblasti ochrany veľkých šeliem s aktívnymi projektmi po celom Slovensku.",
    "about.goals.research.desc":
      "Pokračovať vo vedeckom výskume správania, ekológie a genetiky veľkých šeliem na Slovensku.",
    "about.goals.protection.desc":
      "Chrániť a obnovovať prirodzené prostredie a migračné koridory potrebné pre prežitie šeliem.",
    "about.goals.education.desc": "Vzdelávať verejnosť o význame veľkých šeliem pre ekosystém a potrebu ich ochrany.",

    // Cooperation
    "cooperation.title": "Spolupráce",
    "cooperation.subtitle":
      "Spolupracujeme s rôznymi organizáciami, inštitúciami a odborníkmi na ochrane veľkých šeliem",
    "cooperation.types.title": "Typy spolupráce",
    "cooperation.types.subtitle": "Naša práca je založená na partnerstvách s rôznymi typmi organizácií a inštitúcií",
    "cooperation.types.scientific": "Vedecká spolupráca",
    "cooperation.types.scientific.desc":
      "Spolupracujeme s univerzitami a výskumnými inštitúciami na vedeckých projektoch.",
    "cooperation.types.conservation": "Ochranárske organizácie",
    "cooperation.types.conservation.desc": "Partnerstvo s miestnymi a medzinárodnými ochranárskymi organizáciami.",
    "cooperation.types.institutions": "Štátne inštitúcie",
    "cooperation.types.institutions.desc": "Spolupráca s vládnymi a štátnymi organizáciami na tvorbe politík.",
    "cooperation.types.international": "Medzinárodné projekty",
    "cooperation.types.international.desc":
      "Účasť na medzinárodných projektoch a výmena skúseností s partnermi z celej Európy.",
    "cooperation.benefits.knowledge": "Prístup k najnovším poznatkom",
    "cooperation.benefits.publications": "Spoločné publikácie",
    "cooperation.benefits.experience": "Výmena skúseností",
    "cooperation.benefits.projects": "Spoločné projekty",
    "cooperation.benefits.resources": "Zdieľanie zdrojov",
    "cooperation.benefits.activities": "Koordinované aktivity",
    "cooperation.benefits.legislation": "Legislatívne zmeny",
    "cooperation.benefits.support": "Oficiálna podpora",
    "cooperation.benefits.implementation": "Implementácia opatrení",
    "cooperation.benefits.funding": "Európske financovanie",
    "cooperation.benefits.networks": "Medzinárodné siete",
    "cooperation.benefits.practices": "Najlepšie praktiky",
    "cooperation.partners.title": "Naši partneri",
    "cooperation.partners.subtitle": "Spolupracujeme s renomovanými organizáciami a inštitúciami na Slovensku",
    "cooperation.projects.title": "Spoločné projekty:",
    "cooperation.how.title": "Ako spolupracovať",
    "cooperation.how.subtitle":
      "Máte záujem o spoluprácu? Kontaktujte nás a spoločne nájdeme najlepší spôsob partnerstva",
    "cooperation.steps.contact": "Kontakt",
    "cooperation.steps.contact.desc": "Napíšte nám email s vašou predstavou o spolupráci",
    "cooperation.steps.meeting": "Stretnutie",
    "cooperation.steps.meeting.desc": "Dohodneme si osobné alebo online stretnutie na prediskutovanie možností",
    "cooperation.steps.partnership": "Partnerstvo",
    "cooperation.steps.partnership.desc": "Vytvoríme spoločný plán a začneme realizovať projekty",
    "cooperation.contact.title": "Kontaktujte nás",
    "cooperation.cta.title": "Staňte sa naším partnerom",
    "cooperation.cta.subtitle":
      "Spoločne môžeme dosiahnuť viac pre ochranu veľkých šeliem na Slovensku. Pridajte sa k našej misii.",
    "cooperation.cta.about": "Viac o nás",
    "cooperation.cta.email": "Napísať email",

    // Species page
    "species.page.title": "Veľké šelmy Slovenska",
    "species.page.subtitle": "Spoznajte tri najvýznamnejšie druhy šeliem žijúcich v slovenských lesoch",
    "species.population": "Populácia",
    "species.environment": "Prostredie",
    "species.status": "Status",
    "species.facts": "Zaujímavosti",
    "species.learn.more": "Zistiť viac",
    "species.conservation.title": "Stav ochrany na Slovensku",
    "species.conservation.desc":
      "Všetky tri druhy veľkých šeliem sú na Slovensku chránené zákonom. Naša práca sa zameriava na monitoring populácií, výskum správania a zabezpečenie vhodných podmienok pre ich dlhodobé prežitie.",
    "species.conservation.stable": "Stabilná populácia",
    "species.conservation.stable.desc": "Najstabilnejšia populácia zo všetkých troch",
    "species.conservation.protected": "Chránený",
    "species.conservation.protected.desc": "Populácia sa pomaly zotavuje",
    "species.conservation.endangered": "Kriticky ohrozený",
    "species.conservation.endangered.desc": "Najmenšia populácia, potrebuje okamžitú ochranu",

    // Individual species pages
    "bear.latin": "Ursus arctos",
    "bear.description": "Najväčšia šelma Slovenska s impozantnou postavou a silnými pazúrmi.",
    "bear.environment": "Horské lesy, alpínske lúky",
    "bear.facts.1": "Môže vážiť až 300 kg",
    "bear.facts.2": "Dokáže bežať rýchlosťou 50 km/h",
    "bear.facts.3": "Zimuje 4-6 mesiacov",

    "wolf.latin": "Canis lupus",
    "wolf.description": "Inteligentný a sociálny predátor žijúci v svorách s komplexnou hierarchiou.",
    "wolf.environment": "Lesy, horské oblasti, lúky",
    "wolf.facts.1": "Žije v svorách 4-8 jedincov",
    "wolf.facts.2": "Dokáže bežať rýchlosťou 60 km/h",
    "wolf.facts.3": "Má vynikajúci čuch a sluch",

    // Lynx
    "lynx.latin": "Lynx lynx",
    "lynx.description": "Najväčšia mačkovitá šelma Európy, samotársky a plachý lovec.",
    "lynx.environment": "Horské lesy, skalnaté oblasti",
    "lynx.facts.1": "Dokáže skočiť do výšky 3 metre",
    "lynx.facts.2": "Má výborný nočný zrak",
    "lynx.facts.3": "Loví hlavne srnčiu zver",

    // Blog page
    "blog.page.title": "Blog a novinky",
    "blog.page.subtitle": "Najnovšie informácie o ochrane veľkých šeliem na Slovensku",
    "blog.search": "Hľadať články...",
    "blog.categories": "Všetky kategórie",
    "blog.filter": "Filtrovať",
    "blog.read.more": "Čítať viac",
    "blog.no.posts": "Žiadne články neboli nájdené",
    "blog.no.posts.desc": "Momentálne nemáme publikované žiadne blogové príspevky.",
    "blog.back": "Späť na blog",
    "blog.related": "Súvisiace články",
    "blog.categories.title": "Kategórie",
    "blog.all.articles": "Všetky články",

    // Gallery page
    "gallery.page.title": "Galéria",
    "gallery.page.subtitle": "Fotografie veľkých šeliem Slovenska",
    "gallery.no.photos": "Žiadne fotografie",
    "gallery.no.photos.desc": "Zatiaľ neboli nahrané žiadne fotografie do galérie.",
    "gallery.back": "Späť na galériu",
    "gallery.more.photos": "Ďalšie fotografie",
    "gallery.technical.details": "Technické údaje",
    "gallery.file.size": "Veľkosť súboru",
    "gallery.file.type": "Typ súboru",
    "gallery.file.name": "Názov súboru",
    "gallery.uploaded": "Nahrané",
    "gallery.unknown.size": "Neznáma veľkosť",
    "gallery.unknown.type": "Neznámy",

    // Map page
    "map.page.title": "Mapa výskytu medveďa hnedého",
    "map.page.subtitle":
      "Interaktívna mapa zobrazujúca potvrdené pozorovania, pobytové znaky a strety s medveďom hnedým na Slovensku",
    "map.observations": "Pozorovania",
    "map.observations.desc":
      "Priame pozorovania medveďa hnedého v prirodzenom prostredí. Zahŕňa vizuálne kontakty a fotografické dokumentácie.",
    "map.signs": "Pobytové znaky",
    "map.signs.desc":
      "Nepriame dôkazy prítomnosti medveďa - stopy, trus, škraby na stromoch, poškodené úle a iné znaky aktivity.",
    "map.conflicts": "Strety",
    "map.conflicts.desc": "Konfliktné situácie medzi medveďom a človekom, vrátane škôd na majetku a priamych stretov.",

    // Common
    "common.slovakia": "Slovensko",
    "common.loading": "Načítavam...",
    "common.error": "Chyba",
    "common.success": "Úspech",
    "common.close": "Zavrieť",
    "common.save": "Uložiť",
    "common.cancel": "Zrušiť",
    "common.delete": "Vymazať",
    "common.edit": "Upraviť",
    "common.view": "Zobraziť",
    "common.back": "Späť",
    "common.next": "Ďalej",
    "common.previous": "Predchádzajúce",
    "common.search": "Hľadať",
    "common.filter": "Filtrovať",
    "common.all": "Všetky",
    "common.none": "Žiadne",
    "common.yes": "Áno",
    "common.no": "Nie",

    // Species descriptions titles
    "species.description.title": "Popis",
    "species.habitat.title": "Prostredie",
    "species.diet.title": "Potrava",
    "species.conservation.status.title": "Ochranný status",
    "species.threats.title": "Hlavné hrozby",
    "species.conservation.measures.title": "Ochranné opatrenia",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.species": "Species",
    "nav.map": "Map",
    "nav.blog": "Blog",
    "nav.gallery": "Gallery",
    "nav.cooperation": "Cooperation",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.all-species": "All Species",

    // Species
    "species.bear": "Brown Bear",
    "species.wolf": "Gray Wolf",
    "species.lynx": "Eurasian Lynx",

    // Species descriptions
    "species.bear.description":
      "The largest carnivore in Slovakia, an omnivore with an imposing stature and incredible strength.",
    "species.wolf.description": "Intelligent and social predator living in family packs with complex hierarchy.",
    "species.lynx.description":
      "The largest feline carnivore in Europe with characteristic ear tufts and perfect night vision.",

    // Species populations
    "species.bear.population": "1200-1500 individuals",
    "species.wolf.population": "400-500 individuals",
    "species.lynx.population": "40-60 individuals",

    // Species status
    "species.bear.status": "Stable population",
    "species.wolf.status": "Protected",
    "species.lynx.status": "Critically endangered",

    // Homepage
    "hero.title": "Protection of Large Carnivores in Slovakia",
    "hero.subtitle":
      "We are dedicated to research and protection of bears, wolves and lynx in their natural environment",
    "hero.cta1": "Meet Our Carnivores",
    "hero.cta2": "About Our Work",

    // Stats
    "stats.species": "Carnivore Species",
    "stats.research": "Years of Research",
    "stats.observations": "Observations",

    // Mission
    "mission.title": "Our Mission",
    "mission.description":
      "LCI-SK.eu is an association of experts and enthusiasts dedicated to the protection and research of large carnivores in Slovakia. Our goal is to ensure the long-term survival of brown bears, gray wolves and Eurasian lynx in Slovak forests.",
    "mission.research": "Research",
    "mission.research.desc": "We monitor populations and behavior of large carnivores using the latest technologies",
    "mission.protection": "Protection",
    "mission.protection.desc": "We protect their natural environment and migration corridors for future generations",
    "mission.education": "Education",
    "mission.education.desc": "We educate the public about the importance of these species for the ecosystem",

    // Species section
    "species.title": "Our Carnivores",
    "species.subtitle":
      "Meet the three largest carnivores of Slovakia and learn about their lives, behavior and challenges they face in the modern world.",
    "species.learn-more": "Learn More",

    // Gallery
    "gallery.title": "Photo Gallery",
    "gallery.subtitle": "Discover amazing shots of large carnivores in their natural environment",
    "gallery.bear.standing": "Bear standing upright",
    "gallery.bear.standing.desc": "Young bear standing on hind legs",
    "gallery.bear.forest": "Bear among ferns",
    "gallery.bear.forest.desc": "Adult bear foraging for food",
    "gallery.bear.resting": "Resting bear",
    "gallery.bear.resting.desc": "Bear resting in a meadow",
    "gallery.bear.alert": "Alert bear",
    "gallery.bear.alert.desc": "Bear sitting and observing surroundings",
    "gallery.wolf.winter": "Wolf in winter",
    "gallery.wolf.winter.desc": "Wolf in winter environment",
    "gallery.lynx.forest": "Lynx in forest",
    "gallery.lynx.forest.desc": "Eurasian lynx in natural habitat",

    // Blog
    "blog.title": "Latest from Blog",
    "blog.subtitle": "Follow our latest discoveries, research projects and stories from the world of large carnivores.",
    "blog.all-articles": "All Articles",
    "blog.post1.title": "New bear observations in Tatras",
    "blog.post1.excerpt":
      "Researchers recorded increased brown bear activity in the High Tatras area. Latest data shows positive trends...",
    "blog.post2.title": "Wolf pack in Little Carpathians",
    "blog.post2.excerpt":
      "After many years, wolves have returned to the Little Carpathians area, where they were last observed decades ago...",
    "blog.post3.title": "Lynx hibernation and its importance",
    "blog.post3.excerpt":
      "Winter behavior of lynx is a fascinating process that allows them to survive cold months in mountain environment...",
    "blog.category.research": "Research",
    "blog.category.protection": "Protection",
    "blog.category.education": "Education",

    // CTA
    "cta.title": "Help Us Protect Carnivores",
    "cta.description":
      "Your support is crucial for the success of our projects. Join us and help preserve these amazing species for future generations.",
    "cta.support": "Support Project",

    // Footer
    "footer.partners": "Our Partners",
    "footer.quick-links": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    // Gallery page
    "gallery.search": "Search photos...",
    "gallery.species-filter": "Species",
    "gallery.all": "All",
    "gallery.loading": "Loading observations...",
    "gallery.no-results": "No Results",
    "gallery.no-results.desc": "Try changing filters or search term",

    // Map
    "map.title": "Map of Slovakia",
    "map.subtitle": "Interactive map of large carnivore observations in the Slovak Republic",
    "map.legend.confirmed": "Confirmed Observation",
    "map.legend.signs": "Presence Signs",
    "map.legend.conflict": "Recorded Conflict",

    // About
    "about.title": "About LCI-SK Association",
    "about.subtitle": "We are a team of experts and enthusiasts dedicated to large carnivore protection",
    "about.mission.title": "Our Mission",
    "about.mission.description":
      "The LCI-SK.eu association was founded from the need for systematic protection and research of large carnivores in Slovakia. Our main goal is to ensure the long-term survival of brown bears, gray wolves and Eurasian lynx in their natural environment through scientific research, environmental protection and public education.",
    "about.team": "Our Team",
    "about.team.description":
      "We are a group of experts from various fields, united by our love for nature and interest in large carnivore protection.",
    "about.history": "Association History",
    "about.goals": "Our Goals",
    "about.history.2020.title": "Association Founded",
    "about.history.2020.desc":
      "A group of enthusiasts and conservationists decided to establish an association focused on systematic research and protection of large carnivores in Slovakia.",
    "about.history.2021.title": "First Projects",
    "about.history.2021.desc":
      "We launched the first research projects focused on population monitoring and mapping the occurrence of large carnivores in Slovak forests.",
    "about.history.2023.title": "International Cooperation",
    "about.history.2023.desc":
      "We established cooperation with research institutions in neighboring countries and began coordinated protection projects.",
    "about.history.2025.title": "Present",
    "about.history.2025.desc":
      "Today we are a recognized organization in the field of large carnivore protection with active projects throughout Slovakia.",
    "about.goals.research.desc":
      "Continue scientific research on behavior, ecology and genetics of large carnivores in Slovakia.",
    "about.goals.protection.desc":
      "Protect and restore natural environment and migration corridors needed for carnivore survival.",
    "about.goals.education.desc":
      "Educate the public about the importance of large carnivores for the ecosystem and the need for their protection.",

    // Cooperation
    "cooperation.title": "Cooperation",
    "cooperation.subtitle":
      "We collaborate with various organizations, institutions and experts on large carnivore protection",
    "cooperation.types.title": "Types of Cooperation",
    "cooperation.types.subtitle":
      "Our work is based on partnerships with various types of organizations and institutions",
    "cooperation.types.scientific": "Scientific Cooperation",
    "cooperation.types.scientific.desc":
      "We collaborate with universities and research institutions on scientific projects.",
    "cooperation.types.conservation": "Conservation Organizations",
    "cooperation.types.conservation.desc": "Partnership with local and international conservation organizations.",
    "cooperation.types.institutions": "State Institutions",
    "cooperation.types.institutions.desc": "Cooperation with government and state organizations on policy making.",
    "cooperation.types.international": "International Projects",
    "cooperation.types.international.desc":
      "Participation in international projects and exchange of experience with partners from across Europe.",
    "cooperation.benefits.knowledge": "Access to latest knowledge",
    "cooperation.benefits.publications": "Joint publications",
    "cooperation.benefits.experience": "Exchange of experience",
    "cooperation.benefits.projects": "Joint projects",
    "cooperation.benefits.resources": "Resource sharing",
    "cooperation.benefits.activities": "Coordinated activities",
    "cooperation.benefits.legislation": "Legislative changes",
    "cooperation.benefits.support": "Official support",
    "cooperation.benefits.implementation": "Implementation of measures",
    "cooperation.benefits.funding": "European funding",
    "cooperation.benefits.networks": "International networks",
    "cooperation.benefits.practices": "Best practices",
    "cooperation.partners.title": "Our Partners",
    "cooperation.partners.subtitle": "We collaborate with renowned organizations and institutions in Slovakia",
    "cooperation.projects.title": "Joint projects:",
    "cooperation.how.title": "How to Cooperate",
    "cooperation.how.subtitle":
      "Interested in cooperation? Contact us and together we will find the best way to partner",
    "cooperation.steps.contact": "Contact",
    "cooperation.steps.contact.desc": "Send us an email with your cooperation ideas",
    "cooperation.steps.meeting": "Meeting",
    "cooperation.steps.meeting.desc": "We will arrange a personal or online meeting to discuss possibilities",
    "cooperation.steps.partnership": "Partnership",
    "cooperation.steps.partnership.desc": "We will create a joint plan and start implementing projects",
    "cooperation.contact.title": "Contact Us",
    "cooperation.cta.title": "Become Our Partner",
    "cooperation.cta.subtitle":
      "Together we can achieve more for the protection of large carnivores in Slovakia. Join our mission.",
    "cooperation.cta.about": "More About Us",
    "cooperation.cta.email": "Send Email",

    // Species page
    "species.page.title": "Large Carnivores of Slovakia",
    "species.page.subtitle": "Meet the three most important carnivore species living in Slovak forests",
    "species.population": "Population",
    "species.environment": "Environment",
    "species.status": "Status",
    "species.facts": "Interesting Facts",
    "species.learn.more": "Learn More",
    "species.conservation.title": "Conservation Status in Slovakia",
    "species.conservation.desc":
      "All three large carnivore species are protected by law in Slovakia. Our work focuses on population monitoring, behavioral research and ensuring suitable conditions for their long-term survival.",
    "species.conservation.stable": "Stable Population",
    "species.conservation.stable.desc": "The most stable population of all three",
    "species.conservation.protected": "Protected",
    "species.conservation.protected.desc": "Population is slowly recovering",
    "species.conservation.endangered": "Critically Endangered",
    "species.conservation.endangered.desc": "Smallest population, needs immediate protection",

    // Individual species pages
    "bear.latin": "Ursus arctos",
    "bear.description": "The largest carnivore in Slovakia with an imposing stature and strong claws.",
    "bear.environment": "Mountain forests, alpine meadows",
    "bear.facts.1": "Can weigh up to 300 kg",
    "bear.facts.2": "Can run at speeds of 50 km/h",
    "bear.facts.3": "Hibernates for 4-6 months",

    "wolf.latin": "Canis lupus",
    "wolf.description": "Intelligent and social predator living in packs with complex hierarchy.",
    "wolf.environment": "Forests, mountain areas, meadows",
    "wolf.facts.1": "Lives in packs of 4-8 individuals",
    "wolf.facts.2": "Can run at speeds of 60 km/h",
    "wolf.facts.3": "Has excellent sense of smell and hearing",

    "lynx.latin": "Lynx lynx",
    "lynx.description": "The largest feline carnivore in Europe, solitary and shy hunter.",
    "lynx.environment": "Mountain forests, rocky areas",
    "lynx.facts.1": "Can jump up to 3 meters high",
    "lynx.facts.2": "Has excellent night vision",
    "lynx.facts.3": "Mainly hunts roe deer",

    // Blog page
    "blog.page.title": "Blog and News",
    "blog.page.subtitle": "Latest information about large carnivore protection in Slovakia",
    "blog.search": "Search articles...",
    "blog.categories": "All Categories",
    "blog.filter": "Filter",
    "blog.read.more": "Read More",
    "blog.no.posts": "No articles found",
    "blog.no.posts.desc": "We currently have no published blog posts.",
    "blog.back": "Back to Blog",
    "blog.related": "Related Articles",
    "blog.categories.title": "Categories",
    "blog.all.articles": "All Articles",

    // Gallery page
    "gallery.page.title": "Gallery",
    "gallery.page.subtitle": "Photos of large carnivores in Slovakia",
    "gallery.no.photos": "No Photos",
    "gallery.no.photos.desc": "No photos have been uploaded to the gallery yet.",
    "gallery.back": "Back to Gallery",
    "gallery.more.photos": "More Photos",
    "gallery.technical.details": "Technical Details",
    "gallery.file.size": "File Size",
    "gallery.file.type": "File Type",
    "gallery.file.name": "File Name",
    "gallery.uploaded": "Uploaded",
    "gallery.unknown.size": "Unknown Size",
    "gallery.unknown.type": "Unknown",

    // Map page
    "map.page.title": "Brown Bear Distribution Map",
    "map.page.subtitle":
      "Interactive map showing confirmed observations, presence signs and conflicts with brown bears in Slovakia",
    "map.observations": "Observations",
    "map.observations.desc":
      "Direct observations of brown bears in their natural environment. Includes visual contacts and photographic documentation.",
    "map.signs": "Presence Signs",
    "map.signs.desc":
      "Indirect evidence of bear presence - tracks, droppings, tree scratches, damaged beehives and other signs of activity.",
    "map.conflicts": "Conflicts",
    "map.conflicts.desc":
      "Conflict situations between bears and humans, including property damage and direct encounters.",

    // Common
    "common.slovakia": "Slovakia",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.none": "None",
    "common.yes": "Yes",
    "common.no": "No",

    // Species descriptions titles
    "species.description.title": "Description",
    "species.habitat.title": "Habitat",
    "species.diet.title": "Diet",
    "species.conservation.status.title": "Conservation Status",
    "species.threats.title": "Main Threats",
    "species.conservation.measures.title": "Conservation Measures",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("sk")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "sk" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
