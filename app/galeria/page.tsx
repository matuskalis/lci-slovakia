"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface CategoryData {
  category: string
  count: number
  latestPhoto: string | null
}

const categoryInfo: Record<string, { sk: string; en: string; image: string }> = {
  medved: {
    sk: "Medveď hnedý",
    en: "Brown Bear",
    image: "/images/medved-hnedy-main.jpg",
  },
  vlk: {
    sk: "Vlk dravý",
    en: "Gray Wolf",
    image: "/images/vlk-dravy-main.jpg",
  },
  rys: {
    sk: "Rys ostrovid",
    en: "Eurasian Lynx",
    image: "/images/rys-ostrovid-main.jpg",
  },
}

export default function GaleriaPage() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        // Get photos grouped by category
        const { data: photos, error } = await supabase
          .from("photos")
          .select("category, public_url, uploaded_at")
          .order("uploaded_at", { ascending: false })

        if (error) {
          console.error("Error fetching photos:", error)
          // Fall back to default categories with zero counts
          setCategories([
            { category: "medved", count: 0, latestPhoto: null },
            { category: "vlk", count: 0, latestPhoto: null },
            { category: "rys", count: 0, latestPhoto: null },
          ])
          return
        }

        // Group by category
        const categoryMap: Record<string, { count: number; latestPhoto: string | null }> = {}

        for (const photo of photos || []) {
          if (!categoryMap[photo.category]) {
            categoryMap[photo.category] = { count: 0, latestPhoto: photo.public_url }
          }
          categoryMap[photo.category].count++
        }

        // Ensure all three categories are shown
        const allCategories = ["medved", "vlk", "rys"]
        const result: CategoryData[] = allCategories.map((cat) => ({
          category: cat,
          count: categoryMap[cat]?.count || 0,
          latestPhoto: categoryMap[cat]?.latestPhoto || null,
        }))

        setCategories(result)
      } catch (error) {
        console.error("Error:", error)
        setCategories([
          { category: "medved", count: 0, latestPhoto: null },
          { category: "vlk", count: 0, latestPhoto: null },
          { category: "rys", count: 0, latestPhoto: null },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-[#5f523b] mx-auto mb-4"></div>
          <p className="text-sm lg:text-base text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-20 pb-8 lg:pt-32 lg:pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">{t("gallery.page.title")}</h1>
          <p className="text-sm lg:text-xl opacity-90">{t("gallery.page.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const info = categoryInfo[cat.category]
            const title = info ? (language === "sk" ? info.sk : info.en) : cat.category
            const imageUrl = cat.latestPhoto || info?.image || "/placeholder.svg?height=400&width=600"

            return (
              <Link
                key={cat.category}
                href={`/galeria/${cat.category}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">{title}</h2>
                    <p className="text-white/80 text-sm lg:text-base">
                      {cat.count}{" "}
                      {language === "sk"
                        ? cat.count === 1
                          ? "fotografia"
                          : cat.count < 5
                            ? "fotografie"
                            : "fotografií"
                        : cat.count === 1
                          ? "photo"
                          : "photos"}
                    </p>
                    <div className="mt-3 flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                      {language === "sk" ? "Zobraziť galériu" : "View gallery"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
