"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { useLanguage } from "@/contexts/LanguageContext"
import ImageGallery from "@/components/ImageGallery"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

const categoryInfo: Record<string, { sk: string; en: string; description_sk: string; description_en: string }> = {
  medved: {
    sk: "Medveď hnedý",
    en: "Brown Bear",
    description_sk: "Fotografie medveďa hnedého z našich Karpát",
    description_en: "Photos of brown bears from our Carpathians",
  },
  vlk: {
    sk: "Vlk dravý",
    en: "Gray Wolf",
    description_sk: "Fotografie vlka dravého v jeho prirodzenom prostredí",
    description_en: "Photos of gray wolves in their natural habitat",
  },
  rys: {
    sk: "Rys ostrovid",
    en: "Eurasian Lynx",
    description_sk: "Fotografie rysa ostrovida, majstrovského lovca",
    description_en: "Photos of the Eurasian lynx, a master hunter",
  },
}

export default function CategoryGalleryPage() {
  const params = useParams()
  const category = params.category as string
  const { t, language } = useLanguage()
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)

  const info = categoryInfo[category]
  const title = info ? (language === "sk" ? info.sk : info.en) : category
  const description = info ? (language === "sk" ? info.description_sk : info.description_en) : ""

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        const { data: photos, error } = await supabase
          .from("photos")
          .select("*")
          .eq("category", category)
          .order("uploaded_at", { ascending: false })

        if (error) {
          console.error("Error fetching photos:", error)
          setImages([])
          return
        }

        const mappedImages = (photos || []).map((photo) => ({
          id: photo.id,
          src: photo.public_url,
          alt: photo.description || photo.filename,
          title: photo.description || photo.filename,
          category: photo.category,
          location: language === "sk" ? "Slovensko" : "Slovakia",
          date: new Date(photo.uploaded_at).toLocaleDateString(language === "sk" ? "sk-SK" : "en-US"),
          species: title,
        }))

        setImages(mappedImages)
      } catch (error) {
        console.error("Error:", error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [category, language, title])

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
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-20 pb-8 lg:pt-32 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/galeria">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "sk" ? "Späť na galériu" : "Back to gallery"}
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">{title}</h1>
          <p className="text-sm lg:text-xl opacity-90">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 lg:px-4 xl:px-8 py-6 lg:py-12">
        {images.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-8 w-8 lg:h-12 lg:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
              {language === "sk" ? "Žiadne fotografie" : "No photos"}
            </h3>
            <p className="text-sm lg:text-base text-gray-500">
              {language === "sk"
                ? "V tejto kategórii zatiaľ nie sú žiadne fotografie."
                : "No photos in this category yet."}
            </p>
          </div>
        ) : (
          <ImageGallery images={images} />
        )}
      </div>
    </div>
  )
}
