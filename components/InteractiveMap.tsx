"use client"

import { useState } from "react"
import { MapPin, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface MapProps {
  selectedRegion?: string
}

export function InteractiveMap({ selectedRegion }: MapProps) {
  const { t, language } = useLanguage()
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedYear, setSelectedYear] = useState("2024")

  // Mock data for demonstration
  const observations = [
    { id: 1, species: "bear", lat: 49.1, lng: 20.1, type: "confirmed", date: "2024-01-15" },
    { id: 2, species: "wolf", lat: 48.7, lng: 19.5, type: "signs", date: "2024-02-20" },
    { id: 3, species: "lynx", lat: 49.3, lng: 20.8, type: "confirmed", date: "2024-03-10" },
  ]

  const stats = {
    totalObservations: 1247,
    thisMonth: 89,
    confirmed: 456,
    signs: 791,
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "sk" ? "Druh" : "Species"}
            </label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="all">{language === "sk" ? "Všetky" : "All"}</option>
              <option value="bear">{t("species.bear")}</option>
              <option value="wolf">{t("species.wolf")}</option>
              <option value="lynx">{t("species.lynx")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === "sk" ? "Rok" : "Year"}</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t("map.legend.confirmed")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{t("map.legend.signs")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t("map.legend.conflict")}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-forest mb-1">{stats.totalObservations}</div>
          <div className="text-sm text-gray-600">{language === "sk" ? "Celkom pozorovaní" : "Total Observations"}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.thisMonth}</div>
          <div className="text-sm text-gray-600">{language === "sk" ? "Tento mesiac" : "This Month"}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">{language === "sk" ? "Potvrdené" : "Confirmed"}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.signs}</div>
          <div className="text-sm text-gray-600">{language === "sk" ? "Pobytové znaky" : "Signs"}</div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-96 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-forest mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-forest mb-2">
              {language === "sk" ? "Interaktívna mapa" : "Interactive Map"}
            </h3>
            <p className="text-gray-600">
              {language === "sk"
                ? "Mapa pozorovaní veľkých šeliem na Slovensku"
                : "Map of large carnivore observations in Slovakia"}
            </p>
          </div>

          {/* Mock observation points */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Recent Observations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-forest mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          {language === "sk" ? "Najnovšie pozorovania" : "Recent Observations"}
        </h3>
        <div className="space-y-3">
          {observations.slice(0, 5).map((obs) => (
            <div key={obs.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${obs.type === "confirmed" ? "bg-green-500" : "bg-yellow-500"}`}
                ></div>
                <div>
                  <div className="font-medium">
                    {obs.species === "bear"
                      ? t("species.bear")
                      : obs.species === "wolf"
                        ? t("species.wolf")
                        : t("species.lynx")}
                  </div>
                  <div className="text-sm text-gray-500">{obs.date}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {obs.type === "confirmed" ? t("map.legend.confirmed") : t("map.legend.signs")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
