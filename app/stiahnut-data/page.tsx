"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function StiahnutDataPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 to-secondary/5">
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-20 pb-8 lg:pt-32 lg:pb-16">
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">{t("data.download.title")}</h1>
          <p className="text-sm lg:text-xl text-white/90 max-w-3xl mx-auto">{t("data.download.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("data.download.terms.title")}</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>{t("data.download.terms.source")}</li>
            <li>{t("data.download.terms.attribution")}</li>
            <li>{t("data.download.terms.note")}</li>
          </ul>
        </div>

        <a
          href="/api/medvede"
          download="medvede-lesy-sr.csv"
          className="block w-full bg-[#44623c] text-white text-center rounded-md py-3 text-sm font-semibold hover:bg-[#3a5333]"
        >
          {t("data.download.button")}
        </a>
      </div>
    </div>
  )
}
