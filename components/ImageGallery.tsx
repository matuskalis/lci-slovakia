"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, MapPin, Calendar, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

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

interface ImageGalleryProps {
  images: ImageData[]
  hideFilters?: boolean
  speciesFilter?: string
}

export default function ImageGallery({ images = [], hideFilters = false, speciesFilter }: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { t } = useLanguage()

  // Filter images based on selected category or species filter
  const filteredImages = useMemo(() => {
    if (!images || images.length === 0) return []

    // If speciesFilter is provided, filter by that species only
    if (speciesFilter) {
      return images.filter((image) => image.category === speciesFilter)
    }

    // For main gallery, filter out static images - only show database uploaded photos
    const databasePhotos = images.filter(
      (image) =>
        image.id.length > 10 &&
        !image.id.startsWith("bear-") &&
        !image.id.startsWith("wolf-") &&
        !image.id.startsWith("lynx-"),
    )

    // Otherwise use the category filter (for main gallery)
    if (selectedCategory === "all" || hideFilters) {
      return databasePhotos
    }
    return databasePhotos.filter((image) => image.category === selectedCategory)
  }, [images, selectedCategory, hideFilters, speciesFilter])

  // Get category statistics
  const categoryStats = useMemo(() => {
    if (!images || images.length === 0) return {}

    // If we're filtering by species, don't show category stats
    if (speciesFilter) {
      return { [speciesFilter]: images.filter((img) => img.category === speciesFilter).length }
    }

    // Filter out static images for main gallery stats
    const databasePhotos = images.filter(
      (image) =>
        image.id.length > 10 &&
        !image.id.startsWith("bear-") &&
        !image.id.startsWith("wolf-") &&
        !image.id.startsWith("lynx-"),
    )

    const stats: Record<string, number> = {
      all: databasePhotos.length,
      medved: 0,
      vlk: 0,
      rys: 0,
    }

    databasePhotos.forEach((image) => {
      if (stats[image.category] !== undefined) {
        stats[image.category]++
      }
    })

    return stats
  }, [images, speciesFilter])

  const categories = [
    { id: "all", label: "Všetky", count: categoryStats.all || 0 },
    { id: "medved", label: t("species.bear"), count: categoryStats.medved || 0 },
    { id: "vlk", label: t("species.wolf"), count: categoryStats.vlk || 0 },
    { id: "rys", label: t("species.lynx"), count: categoryStats.rys || 0 },
  ].filter((category) => category.id === "all" || category.count > 0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    // Restore body scroll
    document.body.style.overflow = "unset"
  }

  const goToPrevious = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return

      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxIndex])

  // Handle image load tracking
  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId))
  }

  if (!images || images.length === 0) {
    return (
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
        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">{t("gallery.no.photos")}</h3>
        <p className="text-sm lg:text-base text-gray-500">{t("gallery.no.photos.desc")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-8">
      {/* Category Filter - Only show if hideFilters is false */}
      {!hideFilters && (
        <div className="flex flex-wrap gap-2 lg:gap-4 justify-center px-2 lg:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 lg:px-6 lg:py-3 rounded-full font-medium transition-all duration-200 text-sm lg:text-base ${
                selectedCategory === category.id
                  ? "bg-[#5f523b] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category.label}
              <span className="ml-1 lg:ml-2 text-xs lg:text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Image Grid - Optimized for mobile */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-8 lg:py-12">
          <p className="text-sm lg:text-base text-gray-500">{t("gallery.no.results.desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4 px-2 lg:px-0">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {!loadedImages.has(image.id) && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className={`object-cover group-hover:scale-105 transition-all duration-300 ${
                    loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 25vw"
                  loading="lazy"
                  onLoad={() => handleImageLoad(image.id)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6 lg:h-8 lg:w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox - Mobile optimized */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 lg:p-4">
          <div className="relative max-w-full max-h-full w-full lg:max-w-4xl">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 lg:top-4 lg:right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all touch-manipulation"
            >
              <X className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Navigation Buttons */}
            {lightboxIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all touch-manipulation"
              >
                <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            )}

            {lightboxIndex < filteredImages.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all touch-manipulation"
              >
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative flex items-center justify-center h-full">
              <Image
                src={filteredImages[lightboxIndex].src || "/placeholder.svg"}
                alt={filteredImages[lightboxIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] lg:max-h-[80vh] object-contain"
                priority
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 lg:p-4">
                <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm">
                  {filteredImages[lightboxIndex].location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      {filteredImages[lightboxIndex].location}
                    </div>
                  )}
                  {filteredImages[lightboxIndex].date && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      {filteredImages[lightboxIndex].date}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-black bg-opacity-50 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
