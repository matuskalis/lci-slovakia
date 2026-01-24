"use client"

import { notFound } from "next/navigation"
import ImageGallery from "@/components/ImageGallery"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"

interface SpeciesData {
  name: { sk: string; en: string }
  scientificName: string
  description: { sk: string; en: string }
  habitat: { sk: string; en: string }
  diet: { sk: string; en: string }
  status: { sk: string; en: string }
  threats: { sk: string[]; en: string[] }
  conservation: { sk: string; en: string }
  images: Array<{
    id: string
    src: string
    alt: string
    title: string
    category: string
  }>
}

const speciesData: { [key: string]: SpeciesData } = {
  medved: {
    name: {
      sk: "Medveď hnedý",
      en: "Brown Bear",
    },
    scientificName: "Ursus arctos",
    description: {
      sk: "Medveď hnedý je najväčší európsky predátor a jeden z najvýznamnejších druhov slovenskej fauny. Dospelé jedince môžu dosiahnuť hmotnosť až 300 kg. Sú všežravce s výborným čuchom a sluchom.",
      en: "The brown bear is the largest European predator and one of the most significant species of Slovak fauna. Adult individuals can reach a weight of up to 300 kg. They are omnivores with excellent sense of smell and hearing.",
    },
    habitat: {
      sk: "Rozsiahle lesné komplexy, najmä v horských oblastiach Karpát. Preferuje staré, zmiešané lesy s dostatkom úkrytov a zdrojov potravy.",
      en: "Extensive forest complexes, especially in the mountainous areas of the Carpathians. Prefers old, mixed forests with sufficient shelter and food sources.",
    },
    diet: {
      sk: "Všežravec - rastlinná potrava (bobule, oriešky, korene), ryby, hmyz, malé cicavce, med. V jeseni sa pripravuje na zimný spánok konzumáciou veľkého množstva potravy.",
      en: "Omnivore - plant food (berries, nuts, roots), fish, insects, small mammals, honey. In autumn, it prepares for winter sleep by consuming large amounts of food.",
    },
    status: {
      sk: "Chránený druh",
      en: "Protected species",
    },
    threats: {
      sk: ["Fragmentácia prostredia", "Konflikt s človekom", "Nelegálny lov", "Znečistenie prostredia"],
      en: ["Habitat fragmentation", "Human-wildlife conflict", "Illegal hunting", "Environmental pollution"],
    },
    conservation: {
      sk: "Aktívny monitoring populácie, ochrana prostredia, vzdelávanie verejnosti o spolužití s medveďmi, kompenzačné programy pre poškodených farmárov.",
      en: "Active population monitoring, habitat protection, public education about coexistence with bears, compensation programs for affected farmers.",
    },
    images: [
      {
        id: "bear-hero",
        src: "/images/bear-cub-hero.jpg",
        alt: "Medvedíča v prírode",
        title: "Medvedíča v prírode",
        category: "medved",
      },
    ],
  },
  vlk: {
    name: {
      sk: "Vlk sivý",
      en: "Gray Wolf",
    },
    scientificName: "Canis lupus",
    description: {
      sk: "Vlk sivý je najväčší člen psovitých a predok domáceho psa. Žije v svorke s jasnou hierarchiou. Dospelé jedince dosahujú hmotnosť 25-50 kg.",
      en: "The gray wolf is the largest member of the dog family and ancestor of the domestic dog. Lives in packs with clear hierarchy. Adult individuals reach a weight of 25-50 kg.",
    },
    habitat: {
      sk: "Rozsiahle lesné územia s dostatkom koristi. V minulosti obýval celé Slovensko, dnes sa vyskytuje najmä v horských oblastiach.",
      en: "Extensive forest territories with sufficient prey. In the past, it inhabited all of Slovakia, today it occurs mainly in mountainous areas.",
    },
    diet: {
      sk: "Mäsožravec - hlavne veľké kopytníky (jeleň, srnec, diviačik), ale aj menšie cicavce a vtáky.",
      en: "Carnivore - mainly large ungulates (deer, roe deer, wild boar), but also smaller mammals and birds.",
    },
    status: {
      sk: "Chránený druh",
      en: "Protected species",
    },
    threats: {
      sk: ["Nedostatok koristi", "Fragmentácia prostredia", "Konflikt s chovateľmi dobytka", "Nelegálny lov"],
      en: ["Lack of prey", "Habitat fragmentation", "Conflict with livestock breeders", "Illegal hunting"],
    },
    conservation: {
      sk: "Monitoring populácie, ochrana prostredia, kompenzácie za škody na dobytku, vzdelávanie verejnosti.",
      en: "Population monitoring, habitat protection, compensation for livestock damage, public education.",
    },
    images: [
      {
        id: "wolf-1",
        src: "/images/vlk-dravy-main.jpg",
        alt: "Vlk sivý v lesnom prostredí",
        title: "Vlk sivý v lesnom prostredí",
        category: "vlk",
      },
    ],
  },
  rys: {
    name: {
      sk: "Rys ostrovid",
      en: "Eurasian Lynx",
    },
    scientificName: "Lynx lynx",
    description: {
      sk: "Rys ostrovid je stredne veľká mačkovitá šelma s charakteristickými ušnými štetcami a krátkym chvostom. Je výborný lovec s vynikajúcim zrakom a sluchom.",
      en: "The Eurasian lynx is a medium-sized feline carnivore with characteristic ear tufts and short tail. It is an excellent hunter with outstanding vision and hearing.",
    },
    habitat: {
      sk: "Husté lesy s dostatkom úkrytov, najmä v horských a podhorských oblastiach. Potrebuje veľké územie pre lov.",
      en: "Dense forests with sufficient shelter, especially in mountainous and submontane areas. Requires large territory for hunting.",
    },
    diet: {
      sk: "Špecializovaný lovec - hlavne srnčia zver, ale aj zajace, hlodavce a vtáky.",
      en: "Specialized hunter - mainly roe deer, but also hares, rodents and birds.",
    },
    status: {
      sk: "Kriticky ohrozený druh",
      en: "Critically endangered species",
    },
    threats: {
      sk: ["Veľmi malá populácia", "Nedostatok genetickej diverzity", "Fragmentácia prostredia", "Nedostatok koristi"],
      en: ["Very small population", "Lack of genetic diversity", "Habitat fragmentation", "Lack of prey"],
    },
    conservation: {
      sk: "Reintrodukčný program, genetické posilňovanie populácie, ochrana prostredia, monitoring jedincov.",
      en: "Reintroduction program, genetic reinforcement of population, habitat protection, individual monitoring.",
    },
    images: [
      {
        id: "lynx-1",
        src: "/images/rys-ostrovid-main.jpg",
        alt: "Rys ostrovid v prirodzenom prostredí",
        title: "Rys ostrovid v prirodzenom prostredí",
        category: "rys",
      },
    ],
  },
}

interface Photo {
  id: string
  filename: string
  original_filename: string
  storage_path: string
  public_url: string
  category: "medved" | "vlk" | "rys" | "other"
  description: string
  alt_text: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
  updated_at: string
}

interface ImageData {
  id: string
  src: string
  alt: string
  title: string
  category: string
  location?: string
  date?: string
  species?: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getPhotosFromDatabase(category: string): Promise<ImageData[]> {
  try {
    // Import supabase client here to avoid server-side issues
    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching photos:", error)
      return []
    }

    if (!photos || photos.length === 0) {
      return []
    }

    return photos.map((photo: Photo) => ({
      id: photo.id,
      src: photo.public_url,
      alt: photo.alt_text || photo.description,
      title: photo.description,
      category: photo.category,
      location: "Slovensko",
      date: new Date(photo.created_at).toLocaleDateString("sk-SK"),
      species: getCategoryLabel(photo.category),
    }))
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    medved: "Medveď hnedý",
    vlk: "Vlk dravý",
    rys: "Rys ostrovid",
    other: "Ostatné",
  }
  return labels[category] || category
}

interface PageProps {
  params: { slug: string }
}

export default function SpeciesPageClient({ params }: PageProps) {
  const { language, t } = useLanguage()
  const species = speciesData[params.slug]

  if (!species) {
    notFound()
  }

  // Fetch photos from database based on species category - only show database photos
  const [databasePhotos, setDatabasePhotos] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      const photos = await getPhotosFromDatabase(params.slug)
      setDatabasePhotos(photos)
      setLoading(false)
    }
    fetchPhotos()
  }, [params.slug])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${species.images[0]?.src || "/images/bear-cub-hero.jpg"}')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{species.name[language]}</h1>
          <p className="text-xl md:text-2xl italic opacity-90">{species.scientificName}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#5f523b] mb-6">{t("species.description.title")}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{species.description[language]}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold text-[#5f523b] mb-4">{t("species.habitat.title")}</h3>
                <p className="text-gray-700 leading-relaxed">{species.habitat[language]}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#5f523b] mb-4">{t("species.diet.title")}</h3>
                <p className="text-gray-700 leading-relaxed">{species.diet[language]}</p>
              </div>
            </div>

            {/* Conservation Status */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-[#5f523b] mb-4">{t("species.conservation.status.title")}</h3>
              <p className="text-lg font-medium text-[#44623c] mb-4">{species.status[language]}</p>

              <h4 className="text-xl font-semibold text-gray-800 mb-3">{t("species.threats.title")}:</h4>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {species.threats[language].map((threat, index) => (
                  <li key={index} className="mb-1">
                    {threat}
                  </li>
                ))}
              </ul>

              <h4 className="text-xl font-semibold text-gray-800 mb-3">{t("species.conservation.measures.title")}:</h4>
              <p className="text-gray-700 leading-relaxed">{species.conservation[language]}</p>
            </div>

            {/* Photo Gallery */}
            <div>
              <h3 className="text-2xl font-bold text-[#5f523b] mb-6">{t("gallery.title")}</h3>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t("common.loading")}</p>
                </div>
              ) : databasePhotos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("gallery.no.photos")}</h3>
                  <p className="text-gray-500">
                    {t("gallery.no.photos.desc")} {species.name[language]}.
                  </p>
                </div>
              ) : (
                <ImageGallery images={databasePhotos} hideFilters={true} speciesFilter={params.slug} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
