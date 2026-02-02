"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Upload,
  Camera,
  MapPin,
  Calendar,
  User,
  Mail,
  FileText,
  Navigation,
  Cloud,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { addObservation } from "./action"

export default function DevUploadPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/admin/verify")
        const data = await response.json()

        if (data.authorized) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch {
        router.push("/admin/login")
      }
    }

    verifySession()
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Add selected files to formData
      selectedFiles.forEach((file) => {
        formData.append("photos", file)
      })

      const result = await addObservation(null, formData)

      if (result.success) {
        setMessage({ success: true, text: result.message })
        // Reset form
        setSelectedFiles([])
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ success: false, text: result.message })
      }
    } catch (error) {
      setMessage({ success: false, text: "Nastala neočakávaná chyba" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-neutral">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">🚧 Dev Upload</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Development upload page. Admin authentication required. All fields are optional.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl flex items-center ${
              message.success
                ? "bg-green-100 border border-green-200 text-green-800"
                : "bg-red-100 border border-red-200 text-red-800"
            }`}
          >
            {message.success ? (
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">{message.success ? "Úspech!" : "Chyba"}</p>
              <p className="text-sm">{message.text}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload */}
            <div>
              <label className="block text-lg font-display font-bold text-gray-900 mb-4">
                <Camera className="w-5 h-5 inline mr-2" />
                Fotografie
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  name="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Kliknite pre výber fotografií</p>
                  <p className="text-sm text-gray-500">Podporované formáty: JPG, PNG, WEBP</p>
                </label>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-gray-700">Vybrané súbory ({selectedFiles.length}):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <Camera className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Odstrániť
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Názov pozorovania
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue="Testovanie dev uploadu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Napr. Medveď pri potoku"
                />
              </div>

              <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Druh
                </label>
                <select
                  id="species"
                  name="species"
                  defaultValue="medved"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="medved">Medveď hnedý</option>
                  <option value="vlk">Vlk dravý</option>
                  <option value="rys">Rys ostrovid</option>
                  <option value="iny">Iný druh</option>
                </select>
              </div>
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lokalita
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  defaultValue="Vysoké Tatry"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Napr. Vysoké Tatry, Skalnaté pleso"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Dátum
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Čas
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    defaultValue="14:30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Photographer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="photographer" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Meno fotografa
                </label>
                <input
                  type="text"
                  id="photographer"
                  name="photographer"
                  defaultValue="Dev Tester"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Vaše meno"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue="dev@test.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="vas@email.com"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Popis pozorovania
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue="Testovací upload cez dev stránku."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Opíšte vaše pozorovanie..."
              />
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-2">
                  <Navigation className="w-4 h-4 inline mr-1" />
                  GPS súradnice
                </label>
                <input
                  type="text"
                  id="coordinates"
                  name="coordinates"
                  defaultValue="49.1951, 20.0684"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="49.1234, 20.5678"
                />
              </div>

              <div>
                <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-2">
                  <Cloud className="w-4 h-4 inline mr-1" />
                  Počasie
                </label>
                <select
                  id="weather"
                  name="weather"
                  defaultValue="slnecno"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Vyberte počasie</option>
                  <option value="slnecno">Slnečno</option>
                  <option value="oblacno">Oblačno</option>
                  <option value="hmla">Hmla</option>
                  <option value="dazd">Dážď</option>
                  <option value="sneh">Sneh</option>
                </select>
              </div>

              <div>
                <label htmlFor="behavior" className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-1" />
                  Správanie
                </label>
                <select
                  id="behavior"
                  name="behavior"
                  defaultValue="krmenie"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Vyberte správanie</option>
                  <option value="krmenie">Kŕmenie</option>
                  <option value="odpocinek">Odpočinok</option>
                  <option value="lov">Lov</option>
                  <option value="hra">Hra</option>
                  <option value="pohyb">Pohyb</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || selectedFiles.length === 0}
                className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Nahrávam...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2 inline" />
                    Nahrať pozorovanie
                  </>
                )}
              </button>
              {selectedFiles.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Najprv vyberte aspoň jednu fotografiu</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
