"use client"

import dynamic from "next/dynamic"
import { useLanguage } from "@/contexts/LanguageContext"

// Dynamically import LeafletMap with no SSR to prevent window errors
const LeafletMap = dynamic(() => import("@/components/LeafletMap").then((mod) => ({ default: mod.LeafletMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "500px" }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5f523b] mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Načítava sa mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 to-secondary/5">
      {/* Hero Section - Optimized for mobile */}
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-20 pb-8 lg:pt-32 lg:pb-16">
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">{t("map.page.title")}</h1>
          <p className="text-sm lg:text-xl xl:text-2xl text-white/90 max-w-3xl mx-auto">{t("map.page.subtitle")}</p>
        </div>
      </div>

      {/* Map Section - Optimized spacing for mobile */}
      <div className="container mx-auto px-2 lg:px-4 py-4 lg:py-8">
        <div
          className="bg-white rounded-lg lg:rounded-2xl shadow-xl p-2 lg:p-6"
          style={{
            height: "calc(100vh - 180px)",
            minHeight: "500px",
            maxHeight: "800px",
          }}
        >
          <LeafletMap />
        </div>
      </div>

      {/* Info Section - Compact on mobile */}
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-green-500"></div>
              <h3 className="text-sm lg:text-lg font-semibold">{t("map.observations")}</h3>
            </div>
            <p className="text-xs lg:text-base text-gray-600">{t("map.observations.desc")}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-amber-500"></div>
              <h3 className="text-sm lg:text-lg font-semibold">{t("map.signs")}</h3>
            </div>
            <p className="text-xs lg:text-base text-gray-600">{t("map.signs.desc")}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-red-500"></div>
              <h3 className="text-sm lg:text-lg font-semibold">{t("map.conflicts")}</h3>
            </div>
            <p className="text-xs lg:text-base text-gray-600">{t("map.conflicts.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
