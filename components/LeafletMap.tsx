"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, BarChart3, Menu, X, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
interface BearSighting {
  longitude: number
  latitude: number
  date: string
  category: string
  species: string
  pobytove_znaky: number
  utok: number
  pozorovanie: number
}

interface BearActivity {
  latitude: number
  longitude: number
  date: string
  description: string
  url: string | null
  utok: boolean
  year: number
}

interface HlaseniePoint {
  latitude: number
  longitude: number
}

const HLASENIA_LUDI_POINTS: HlaseniePoint[] = [
  { latitude: 49.344227, longitude: 18.500609 },
  { latitude: 49.354962, longitude: 18.526015 },
  { latitude: 49.442121, longitude: 18.668266 },
  { latitude: 49.38427, longitude: 18.637086 },
  { latitude: 49.403569, longitude: 18.703175 },
  { latitude: 49.402229, longitude: 18.716907 },
  { latitude: 49.397313, longitude: 18.742313 },
  { latitude: 49.486607, longitude: 18.782825 },
  { latitude: 49.495527, longitude: 18.898869 },
  { latitude: 49.387928, longitude: 18.833637 },
  { latitude: 49.345896, longitude: 18.780079 },
  { latitude: 49.339998, longitude: 18.856655 },
  { latitude: 49.331345, longitude: 18.874555 },
  { latitude: 49.327205, longitude: 18.832405 },
  { latitude: 49.361438, longitude: 18.910931 },
  { latitude: 49.289183, longitude: 18.757343 },
  { latitude: 49.276754, longitude: 18.745795 },
  { latitude: 49.279014, longitude: 18.783903 },
  { latitude: 49.264321, longitude: 18.772355 },
  { latitude: 49.256408, longitude: 18.744063 },
  { latitude: 49.236431, longitude: 18.756188 },
]

interface FilterState {
  pobytove_znaky: boolean
  pozorovanie: boolean
  stret: boolean
  hlasenia_ludi: boolean
  aktuality: boolean
}

export function LeafletMap() {
  const { language } = useLanguage()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const hlaseniaMarkersRef = useRef<any[]>([])
  const aktualityMarkersRef = useRef<any[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [allSightings, setAllSightings] = useState<BearSighting[]>([])
  const [filteredSightings, setFilteredSightings] = useState<BearSighting[]>([])
  const [bearActivities, setBearActivities] = useState<BearActivity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<BearActivity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileControls, setShowMobileControls] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    pobytove_znaky: true,
    pozorovanie: true,
    stret: true,
    hlasenia_ludi: false,
    aktuality: true,
  })
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [availableYears, setAvailableYears] = useState<string[]>([])

  // Check if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Parse CSV data with new format
  const parseCSV = (csvText: string): BearSighting[] => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",")

    const results = lines
      .slice(1)
      .map((line) => {
        // Handle CSV parsing with potential commas in quoted fields
        const values = []
        let current = ""
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim())

        // Map the new CSV structure
        const objectId = values[0] || ""
        const ohrozenie = values[1] || ""
        const datum = values[2] || ""
        const poznamka = values[3] || ""
        const druhOhrozenia = values[4] || ""
        const ohrozenieDetail = values[5] || ""
        const hodinaVyskytu = values[6] || ""
        const y = values[7] || ""
        const x = values[8] || ""

        // Convert coordinates (they use comma as decimal separator)
        const longitude = Number.parseFloat(x.replace(",", "."))
        const latitude = Number.parseFloat(y.replace(",", "."))

        // Categorize based on "Ohrozenie" field
        let pobytove_znaky = 0
        let utok = 0
        let pozorovanie = 0
        let category = "Pozorovanie"

        if (ohrozenie.includes("vizuálny kontakt")) {
          pozorovanie = 1
          category = "Pozorovanie"
        } else if (ohrozenie.includes("pobytové znaky")) {
          pobytove_znaky = 1
          category = "Pobytové znaky"
        } else if (ohrozenie.includes("útok")) {
          utok = 1
          category = "Stret"
        }

        return {
          longitude,
          latitude,
          date: datum,
          category,
          species: language === "sk" ? "Medveď hnedý" : "Brown Bear",
          pobytove_znaky,
          utok,
          pozorovanie,
        }
      })
      .filter(
        (sighting) =>
          !isNaN(sighting.longitude) &&
          !isNaN(sighting.latitude) &&
          sighting.longitude !== 0 &&
          sighting.latitude !== 0,
      )

    // Extract unique years from the data
    const years = [
      ...new Set(
        results.map((sighting) => {
          try {
            const date = new Date(sighting.date)
            return date.getFullYear().toString()
          } catch {
            return new Date().getFullYear().toString()
          }
        }),
      ),
    ].sort((a, b) => Number.parseInt(b) - Number.parseInt(a)) // Sort descending

    setAvailableYears(years)
    return results
  }

  // Fetch CSV data and bear activities
  useEffect(() => {
    if (!isMounted) return

    const fetchData = async () => {
      try {
        // Fetch CSV data
        const csvResponse = await fetch("/images/medvede-export.csv")
        const csvText = await csvResponse.text()
        const sightings = parseCSV(csvText)
        setAllSightings(sightings)
        setFilteredSightings(sightings)

        // Fetch bear activities from sprejnamedveda.sk
        const activitiesResponse = await fetch("/data/bear-activities.json")
        const activities: BearActivity[] = await activitiesResponse.json()
        setBearActivities(activities)
        setFilteredActivities(activities)

        // Add years from activities to available years
        const activityYears = [...new Set(activities.map(a => a.year.toString()))]
        setAvailableYears(prev => {
          const combined = [...new Set([...prev, ...activityYears])]
          return combined.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [isMounted])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !isMounted) return

    const initMap = async () => {
      try {
        // Load Leaflet from CDN
        if (typeof window !== "undefined" && !(window as any).L) {
          // Load CSS
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)

          // Add custom popup styles
          const customStyles = document.createElement("style")
          customStyles.textContent = `
            .leaflet-popup-content-wrapper {
              border-radius: 12px !important;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
              padding: 0 !important;
              overflow: hidden;
            }
            .leaflet-popup-content {
              margin: 12px 14px !important;
              line-height: 1.5 !important;
            }
            .leaflet-popup-tip {
              box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.1) !important;
            }
            .leaflet-popup-close-button {
              color: #6b7280 !important;
              font-size: 20px !important;
              padding: 8px 10px !important;
              width: auto !important;
              height: auto !important;
            }
            .leaflet-popup-close-button:hover {
              color: #1f2937 !important;
              background: transparent !important;
            }
          `
          document.head.appendChild(customStyles)

          // Load JS
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (typeof window !== "undefined" && (window as any).L) {
          const L = (window as any).L

          // Fix for default markers
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          })

          // Get screen width safely
          const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024

          // Create map with initial zoom 5 and smoother interactions
          const map = L.map(mapRef.current!, {
            center: [48.669, 19.699],
            zoom: 5,
            minZoom: 7,
            maxZoom: 16,
            maxBounds: [
              [47.5, 16.5],
              [49.8, 22.8],
            ],
            maxBoundsViscosity: 1.0,
            zoomControl: screenWidth >= 768,
            attributionControl: false,
            zoomAnimation: true,
            zoomAnimationThreshold: 4,
            fadeAnimation: true,
            markerZoomAnimation: true,
            inertia: true,
            inertiaDeceleration: 3000,
            inertiaMaxSpeed: 1500,
            worldCopyJump: false,
          })

          // Add attribution control in bottom right for desktop only
          if (screenWidth >= 768) {
            L.control
              .attribution({
                position: "bottomright",
                prefix: false,
              })
              .addTo(map)
          }

          // Create different tile layers
          const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: 0,
            crossOrigin: true,
          })

          const terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors, © OpenTopoMap",
            maxZoom: 17,
          })

          // Add default layer
          osmLayer.addTo(map)

          // Create layer control
          const baseLayers = {
            [language === "sk" ? "Mapa" : "Map"]: osmLayer,
            [language === "sk" ? "Terén" : "Terrain"]: terrainLayer,
          }

          L.control
            .layers(baseLayers, null, {
              position: "topright",
              collapsed: false,
            })
            .addTo(map)

          mapInstanceRef.current = map
          setIsLoading(false)

          // Force resize after initialization
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize()
            }
          }, 100)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isMounted])

  // Update markers when filtered sightings change
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading || !isMounted || typeof window === "undefined" || !(window as any).L)
      return

    const updateMarkers = () => {
      const L = (window as any).L

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Get current zoom level
      const currentZoom = mapInstanceRef.current.getZoom()
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024

      // Add new markers
      filteredSightings.forEach((sighting) => {
        let color = "#22c55e" // Default green for observations
        let categoryText = "Pozorovanie"

        if (sighting.utok > 0) {
          color = "#ef4444" // Red for attacks
          categoryText = "Stret"
        } else if (sighting.pobytove_znaky > 0) {
          color = "#f59e0b" // Amber for residence signs
          categoryText = "Pobytové znaky"
        }

        let marker

        // Use different marker styles based on zoom level
        if (currentZoom < 11) {
          // Use pin-style markers similar to sprejnamedveda.sk
          const pinIcon = L.divIcon({
            className: "custom-pin-marker",
            html: `<div style="
              position: relative;
              width: 16px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border: 1px solid ${color === "#22c55e" ? "#16a34a" : color === "#f59e0b" ? "#d97706" : "#dc2626"};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                position: absolute;
                top: 1px;
                left: 2px;
              "></div>
              <div style="
                width: 5px;
                height: 5px;
                background-color: ${color};
                border: 1px solid ${color === "#22c55e" ? "#16a34a" : color === "#f59e0b" ? "#d97706" : "#dc2626"};
                border-radius: 50%;
                position: absolute;
                top: 5px;
                left: 5.5px;
                z-index: 1;
              "></div>
            </div>`,
            iconSize: [16, 22],
            iconAnchor: [8, 22],
          })

          marker = L.marker([sighting.latitude, sighting.longitude], {
            icon: pinIcon,
          })
        } else {
          // Use circles for zoom levels 11 and above (larger and more noticeable)
          marker = L.circle([sighting.latitude, sighting.longitude], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 4,
            radius: screenWidth < 768 ? 400 : 300,
          })
        }

        // Format date to show only month and year
        let formattedDate = ""
        try {
          const date = new Date(sighting.date)
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear()
            const month = date.toLocaleDateString(language === "sk" ? "sk-SK" : "en-US", { month: "long" })
            formattedDate = `${month} ${year}`
          } else {
            formattedDate = sighting.date
          }
        } catch (error) {
          formattedDate = sighting.date
        }

        const translatedCategory = language === "sk"
          ? categoryText
          : categoryText === "Pozorovanie"
            ? "Observation"
            : categoryText === "Pobytové znaky"
              ? "Presence Signs"
              : categoryText === "Stret"
                ? "Conflict"
                : categoryText

        marker.bindPopup(`
          <div style="
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 200px;
            padding: 4px;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
            ">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: ${color};
              "></div>
              <span style="
                font-size: 12px;
                font-weight: 600;
                color: ${color};
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">${translatedCategory}</span>
            </div>
            <h3 style="
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 8px 0;
              color: #1f2937;
            ">${sighting.species}</h3>
            <p style="
              font-size: 14px;
              color: #6b7280;
              margin: 0;
            ">
              <strong>${language === "sk" ? "Datum" : "Date"}:</strong> ${formattedDate}
            </p>
          </div>
        `)

        marker.addTo(mapInstanceRef.current)
        markersRef.current.push(marker)
      })
    }

    updateMarkers()

    // Add zoom event listener to update markers when zoom changes
    const handleZoomEnd = () => {
      updateMarkers()
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.on("zoomend", handleZoomEnd)
    }

    // Cleanup zoom event listener
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("zoomend", handleZoomEnd)
      }
    }
  }, [filteredSightings, isLoading, language, isMounted])

  useEffect(() => {
    if (!mapInstanceRef.current || isLoading || !isMounted || typeof window === "undefined" || !(window as any).L)
      return

    const L = (window as any).L

    // Clear existing hlasenia markers
    hlaseniaMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    hlaseniaMarkersRef.current = []

    // Only add markers if filter is enabled
    if (!filters.hlasenia_ludi) return

    const currentZoom = mapInstanceRef.current.getZoom()
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024
    const color = "#ffffff" // White color for hlasenia ludi

    HLASENIA_LUDI_POINTS.forEach((point) => {
      let marker

      if (currentZoom < 11) {
        const pinIcon = L.divIcon({
          className: "custom-pin-marker",
          html: `<div style="
            position: relative;
            width: 16px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: ${color};
              border: 2px solid #374151;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              position: absolute;
              top: 1px;
              left: 2px;
            "></div>
            <div style="
              width: 5px;
              height: 5px;
              background-color: ${color};
              border: 1px solid #374151;
              border-radius: 50%;
              position: absolute;
              top: 5px;
              left: 5.5px;
              z-index: 1;
            "></div>
          </div>`,
          iconSize: [16, 22],
          iconAnchor: [8, 22],
        })

        marker = L.marker([point.latitude, point.longitude], {
          icon: pinIcon,
        })
      } else {
        marker = L.circle([point.latitude, point.longitude], {
          color: "#374151",
          fillColor: color,
          fillOpacity: 0.9,
          weight: 2,
          radius: screenWidth < 768 ? 400 : 300,
        })
      }

      marker.bindPopup(`
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          min-width: 200px;
          padding: 4px;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <div style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #ffffff;
              border: 2px solid #374151;
            "></div>
            <span style="
              font-size: 12px;
              font-weight: 600;
              color: #374151;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">${language === "sk" ? "Hlásenia ľudí" : "People Reports"}</span>
          </div>
          <h3 style="
            font-size: 16px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #1f2937;
          ">${language === "sk" ? "Hlásenie od občana" : "Citizen Report"}</h3>
          <p style="
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          ">
            ${language === "sk" ? "Nahlásený výskyt medveďa" : "Reported bear sighting"}
          </p>
        </div>
      `)

      marker.addTo(mapInstanceRef.current)
      hlaseniaMarkersRef.current.push(marker)
    })

    // Update on zoom
    const handleZoomEnd = () => {
      // Clear and re-add markers
      hlaseniaMarkersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      hlaseniaMarkersRef.current = []

      if (!filters.hlasenia_ludi) return

      const newZoom = mapInstanceRef.current.getZoom()

      HLASENIA_LUDI_POINTS.forEach((point) => {
        let marker

        if (newZoom < 11) {
          const pinIcon = L.divIcon({
            className: "custom-pin-marker",
            html: `<div style="
              position: relative;
              width: 16px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border: 2px solid #374151;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                position: absolute;
                top: 1px;
                left: 2px;
              "></div>
              <div style="
                width: 5px;
                height: 5px;
                background-color: ${color};
                border: 1px solid #374151;
                border-radius: 50%;
                position: absolute;
                top: 5px;
                left: 5.5px;
                z-index: 1;
              "></div>
            </div>`,
            iconSize: [16, 22],
            iconAnchor: [8, 22],
          })

          marker = L.marker([point.latitude, point.longitude], {
            icon: pinIcon,
          })
        } else {
          marker = L.circle([point.latitude, point.longitude], {
            color: "#374151",
            fillColor: color,
            fillOpacity: 0.9,
            weight: 2,
            radius: screenWidth < 768 ? 400 : 300,
          })
        }

        marker.bindPopup(`
          <div style="
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 200px;
            padding: 4px;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
            ">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #ffffff;
                border: 2px solid #374151;
              "></div>
              <span style="
                font-size: 12px;
                font-weight: 600;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">${language === "sk" ? "Hlásenia ľudí" : "People Reports"}</span>
            </div>
            <h3 style="
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 8px 0;
              color: #1f2937;
            ">${language === "sk" ? "Hlásenie od občana" : "Citizen Report"}</h3>
            <p style="
              font-size: 14px;
              color: #6b7280;
              margin: 0;
            ">
              ${language === "sk" ? "Nahlásený výskyt medveďa" : "Reported bear sighting"}
            </p>
          </div>
        `)

        marker.addTo(mapInstanceRef.current)
        hlaseniaMarkersRef.current.push(marker)
      })
    }

    mapInstanceRef.current.on("zoomend", handleZoomEnd)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("zoomend", handleZoomEnd)
      }
    }
  }, [filters.hlasenia_ludi, isLoading, language, isMounted])

  // Filter sightings based on active filters
  useEffect(() => {
    const filtered = allSightings.filter((sighting) => {
      // Year filter
      try {
        const sightingYear = new Date(sighting.date).getFullYear().toString()
        if (sightingYear !== selectedYear) return false
      } catch {
        // If date parsing fails, exclude from current year filter
        if (selectedYear !== new Date().getFullYear().toString()) return false
      }

      // Category filters
      if (filters.stret && sighting.utok > 0) return true
      if (filters.pobytove_znaky && sighting.pobytove_znaky > 0) return true
      if (filters.pozorovanie && sighting.pozorovanie > 0) return true
      return false
    })
    setFilteredSightings(filtered)

    // Filter bear activities by year
    const filteredActs = bearActivities.filter((activity) => {
      return activity.year.toString() === selectedYear
    })
    setFilteredActivities(filteredActs)
  }, [allSightings, bearActivities, filters, selectedYear])

  // Update aktuality markers
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading || !isMounted || typeof window === "undefined" || !(window as any).L)
      return

    const L = (window as any).L

    // Clear existing aktuality markers
    aktualityMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    aktualityMarkersRef.current = []

    // Only add markers if filter is enabled
    if (!filters.aktuality) return

    const currentZoom = mapInstanceRef.current.getZoom()
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024

    const updateAktualityMarkers = () => {
      // Clear existing
      aktualityMarkersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      aktualityMarkersRef.current = []

      if (!filters.aktuality) return

      const zoom = mapInstanceRef.current.getZoom()

      filteredActivities.forEach((activity) => {
        // Purple color for aktuality, red border if it's an attack
        const color = activity.utok ? "#dc2626" : "#8b5cf6" // Red for attacks, purple for observations
        const borderColor = activity.utok ? "#991b1b" : "#7c3aed"

        let marker

        if (zoom < 11) {
          const pinIcon = L.divIcon({
            className: "custom-pin-marker aktuality",
            html: `<div style="
              position: relative;
              width: 16px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border: 2px solid ${borderColor};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                position: absolute;
                top: 1px;
                left: 2px;
              "></div>
              <div style="
                width: 5px;
                height: 5px;
                background-color: white;
                border-radius: 50%;
                position: absolute;
                top: 5px;
                left: 5.5px;
                z-index: 1;
              "></div>
            </div>`,
            iconSize: [16, 22],
            iconAnchor: [8, 22],
          })

          marker = L.marker([activity.latitude, activity.longitude], {
            icon: pinIcon,
          })
        } else {
          marker = L.circle([activity.latitude, activity.longitude], {
            color: borderColor,
            fillColor: color,
            fillOpacity: 0.8,
            weight: 3,
            radius: screenWidth < 768 ? 400 : 300,
          })
        }

        // Format date
        const formattedDate = activity.date

        // Create popup content with link if available
        const linkHtml = activity.url
          ? `<a href="${activity.url}" target="_blank" rel="noopener noreferrer" style="
              display: inline-block;
              margin-top: 8px;
              font-size: 13px;
              color: #8b5cf6;
              text-decoration: none;
              font-weight: 500;
            ">${language === "sk" ? "Citaj viac" : "Read more"} &rarr;</a>`
          : ""

        const typeColor = activity.utok ? "#dc2626" : "#8b5cf6"
        const typeText = activity.utok
          ? (language === "sk" ? "Utok" : "Attack")
          : (language === "sk" ? "Pozorovanie" : "Observation")

        marker.bindPopup(`
          <div style="
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 220px;
            max-width: 280px;
            padding: 4px;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;
            ">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: ${typeColor};
              "></div>
              <span style="
                font-size: 12px;
                font-weight: 600;
                color: ${typeColor};
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">${typeText}</span>
            </div>
            <h3 style="
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 8px 0;
              color: #1f2937;
            ">${language === "sk" ? "Medvedia aktualita" : "Bear Activity"}</h3>
            <p style="
              font-size: 14px;
              color: #4b5563;
              margin: 0 0 8px 0;
              line-height: 1.4;
            ">${activity.description}</p>
            <p style="
              font-size: 13px;
              color: #6b7280;
              margin: 0;
            ">
              <strong>${language === "sk" ? "Datum" : "Date"}:</strong> ${formattedDate}
            </p>
            ${linkHtml}
          </div>
        `)

        marker.addTo(mapInstanceRef.current)
        aktualityMarkersRef.current.push(marker)
      })
    }

    updateAktualityMarkers()

    // Update on zoom
    const handleZoomEnd = () => {
      updateAktualityMarkers()
    }

    mapInstanceRef.current.on("zoomend", handleZoomEnd)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("zoomend", handleZoomEnd)
      }
    }
  }, [filters.aktuality, filteredActivities, isLoading, language, isMounted])

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked,
    }))
  }

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return

    try {
      const query = `${searchQuery}, Slovakia`
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      )
      const results = await response.json()

      if (results.length > 0) {
        const { lat, lon } = results[0]
        mapInstanceRef.current.setView([Number.parseFloat(lat), Number.parseFloat(lon)], 12)
      } else {
        alert(language === "sk" ? "Miesto nebolo nájdené" : "Location not found")
      }
    } catch (error) {
      console.error("Search error:", error)
      alert(language === "sk" ? "Chyba pri vyhľadávaní" : "Search error")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Don't render anything until mounted (prevents SSR issues)
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "500px" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5f523b] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">{language === "sk" ? "Načítava sa mapa..." : "Loading map..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mobile Controls Toggle */}
      <div className="lg:hidden mb-2">
        <Button
          onClick={() => setShowMobileControls(!showMobileControls)}
          className="w-full bg-[#5f523b] hover:bg-[#4a3f2f] text-white"
          size="sm"
        >
          {showMobileControls ? (
            <>
              <X className="w-4 h-4 mr-2" />
              {language === "sk" ? "Skryť ovládanie" : "Hide Controls"}
            </>
          ) : (
            <>
              <Menu className="w-4 h-4 mr-2" />
              {language === "sk" ? "Zobraziť ovládanie" : "Show Controls"}
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 flex-1">
        {/* Controls Panel */}
        <div
          className={`lg:w-80 bg-white rounded-lg shadow-lg p-3 lg:p-6 space-y-3 lg:space-y-6 ${
            showMobileControls ? "block" : "hidden lg:block"
          } ${showMobileControls ? "mb-2" : ""}`}
        >
          {/* Search */}
          <div className="space-y-2">
            <h3 className="text-sm lg:text-lg font-semibold flex items-center gap-2">
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
              {language === "sk" ? "Vyhľadávanie" : "Search"}
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder={language === "sk" ? "Zadajte miesto..." : "Enter location..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button onClick={handleSearch} size="sm" className="bg-[#5f523b] hover:bg-[#4a3f2f]">
                <Search className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <h3 className="text-sm lg:text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
              {language === "sk" ? "Rok" : "Year"}
            </h3>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={language === "sk" ? "Vyberte rok" : "Select year"} />
              </SelectTrigger>
              <SelectContent>
                {availableYears
                  .filter((year) => year !== "202")
                  .map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {language === "sk"
                ? `Zobrazujú sa údaje za rok ${selectedYear}`
                : `Showing data for year ${selectedYear}`}
            </p>
          </div>

          {/* Category Filters */}
          <div className="space-y-2 lg:space-y-3">
            <h3 className="text-sm lg:text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
              {language === "sk" ? "Kategórie" : "Categories"}
            </h3>

            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Checkbox
                  id="pobytove_znaky"
                  checked={filters.pobytove_znaky}
                  onCheckedChange={(checked) => handleFilterChange("pobytove_znaky", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-amber-500"></div>
                  <label htmlFor="pobytove_znaky" className="text-xs lg:text-sm font-medium">
                    {language === "sk" ? "Pobytové znaky" : "Presence Signs"}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3">
                <Checkbox
                  id="pozorovanie"
                  checked={filters.pozorovanie}
                  onCheckedChange={(checked) => handleFilterChange("pozorovanie", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-green-500"></div>
                  <label htmlFor="pozorovanie" className="text-xs lg:text-sm font-medium">
                    {language === "sk" ? "Pozorovanie" : "Observation"}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3">
                <Checkbox
                  id="stret"
                  checked={filters.stret}
                  onCheckedChange={(checked) => handleFilterChange("stret", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-red-500"></div>
                  <label htmlFor="stret" className="text-xs lg:text-sm font-medium">
                    {language === "sk" ? "Stret" : "Conflict"}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3">
                <Checkbox
                  id="hlasenia_ludi"
                  checked={filters.hlasenia_ludi}
                  onCheckedChange={(checked) => handleFilterChange("hlasenia_ludi", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-white border-2 border-gray-700"></div>
                  <label htmlFor="hlasenia_ludi" className="text-xs lg:text-sm font-medium">
                    {language === "sk" ? "Hlásenia ľudí" : "People Reports"}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3">
                <Checkbox
                  id="aktuality"
                  checked={filters.aktuality}
                  onCheckedChange={(checked) => handleFilterChange("aktuality", checked as boolean)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-purple-500"></div>
                  <label htmlFor="aktuality" className="text-xs lg:text-sm font-medium">
                    {language === "sk" ? "Aktuality (sprejnamedveda.sk)" : "News (sprejnamedveda.sk)"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-2 lg:space-y-3">
            <h3 className="text-sm lg:text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
              {language === "sk" ? "Štatistiky" : "Statistics"}
            </h3>

            <div className="bg-gray-50 rounded-lg p-2 lg:p-4 space-y-1 lg:space-y-2">
              <div className="flex justify-between">
                <span className="text-xs lg:text-sm text-gray-600">
                  {language === "sk" ? "Zobrazené:" : "Displayed:"}
                </span>
                <span className="font-semibold text-xs lg:text-sm">
                  {filteredSightings.length + (filters.hlasenia_ludi ? HLASENIA_LUDI_POINTS.length : 0) + (filters.aktuality ? filteredActivities.length : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs lg:text-sm text-gray-600">{language === "sk" ? "Celkom:" : "Total:"}</span>
                <span className="font-semibold text-xs lg:text-sm">
                  {allSightings.length + HLASENIA_LUDI_POINTS.length + bearActivities.length}
                </span>
              </div>
              {filters.aktuality && filteredActivities.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">
                    {language === "sk" ? "Aktuality:" : "News:"}
                  </span>
                  <span className="font-semibold text-xs lg:text-sm text-purple-600">
                    {filteredActivities.length}
                  </span>
                </div>
              )}
              <div className="pt-1 lg:pt-2 border-t">
                <div className="text-xs text-gray-500">
                  {language === "sk"
                    ? "Údaje o výskyte medveďa hnedého na Slovensku"
                    : "Brown bear occurrence data in Slovakia"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative z-0 min-h-[400px] lg:min-h-[500px]">
          <div
            ref={mapRef}
            className="w-full h-full rounded-lg shadow-lg"
            style={{
              minHeight: "400px",
              height: "100%",
            }}
          />

          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-[#5f523b] mx-auto mb-2"></div>
                <p className="text-xs lg:text-sm text-gray-600">
                  {language === "sk" ? "Načítava sa mapa..." : "Loading map..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
