"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, Camera, User, FileText, AlertCircle, CheckCircle, Lock } from "lucide-react"
import { addObservation } from "./action"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-client"

export default function AddPhotoPage() {
  const searchParams = useSearchParams()
  const submissionSuccess = searchParams.get("success") === "true"
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    species: "",
    location: "",
    date: "",
    time: "",
    photographer: "",
    email: "",
    description: "",
    coordinates: "",
    weather: "",
    behavior: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setUserRole(null)
          setUser(null)
          setLoading(false)
          return
        }

        setUser(user)

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
          setUserRole("user") // Default to user if error
        } else {
          setUserRole(profile?.role || "user")
        }
      } catch (error) {
        console.error("Error checking user role:", error)
        setUserRole(null)
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUserRole()
      } else {
        setUser(null)
        setUserRole(null)
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Reset form after successful submission
  useEffect(() => {
    if (submissionSuccess) {
      setFormData({
        title: "",
        species: "",
        location: "",
        date: "",
        time: "",
        photographer: "",
        email: "",
        description: "",
        coordinates: "",
        weather: "",
        behavior: "",
      })
      setFiles([])
    }
  }, [submissionSuccess])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formDataObj = new FormData(e.currentTarget)

      // Add selected files to formData
      files.forEach((file) => {
        formDataObj.append("files", file)
      })

      const result = await addObservation(null, formDataObj)

      if (result.success) {
        setMessage({ success: true, text: result.message })
        // Reset form
        setFiles([])
        setFormData({
          title: "",
          species: "",
          location: "",
          date: "",
          time: "",
          photographer: "",
          email: "",
          description: "",
          coordinates: "",
          weather: "",
          behavior: "",
        })
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-gray-600">Načítavam...</span>
      </div>
    )
  }

  // Show access denied if user is not logged in or doesn't have upload permissions
  if (!user || !userRole || !["admin", "uploader"].includes(userRole)) {
    return (
      <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="card text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-red-600 mb-4">Prístup zamietnutý</h2>
          <p className="text-gray-600 mb-6">
            {!user
              ? "Pre pridávanie pozorovaní sa musíte prihlásiť a mať oprávnenie na nahrávanie."
              : "Nemáte oprávnenie na pridávanie pozorovaní. Kontaktujte administrátora."}
          </p>
          {!user ? (
            <a href="/prihlasenie" className="btn-primary">
              Prihlásiť sa
            </a>
          ) : (
            <a href="/" className="btn-primary">
              Späť na hlavnú stránku
            </a>
          )}
        </motion.div>
      </div>
    )
  }

  if (submissionSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="card text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Ďakujeme!</h2>
          <p className="text-gray-600 mb-6">Vaše pozorovanie bolo úspešne odoslané a pridané do databázy.</p>
          <button
            onClick={() => {
              window.history.replaceState(null, "", "/pridat-fotku")
            }}
            className="btn-primary"
          >
            Pridať ďalšie pozorovanie
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-neutral">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Pridať pozorovanie</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Pridajte nové pozorovanie veľkých šeliem na Slovensku
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Oprávnený používateľ ({userRole})
            </div>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center">
              <Camera className="w-6 h-6 mr-3" />
              Fotografie
            </h2>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
                dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Pretiahnite súbory sem alebo kliknite pre výber</p>
              <p className="text-sm text-gray-500 mb-4">Podporované formáty: JPG, PNG, HEIC (max. 10MB)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                name="files"
              />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                Vybrať súbory
              </label>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-4">Vybrané súbory ({files.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors duration-300"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="card"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              Základné informácie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Názov pozorovania *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. Rys v zimnom lese"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Druh šelmy *</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Vyberte druh</option>
                  <option value="rys">Rys ostrovid</option>
                  <option value="vlk">Vlk dravý</option>
                  <option value="medved">Medveď hnedý</option>
                  <option value="iny">Iný druh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokalita *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. Vysoké Tatry, Skalnaté pleso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPS súradnice</label>
                <input
                  type="text"
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. 49.1951, 20.0684"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dátum pozorovania *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Čas pozorovania</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Popis pozorovania</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Opíšte čo ste pozorovali, správanie zvieraťa, okolnosti..."
              />
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6">Dodatočné informácie</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Počasie</label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Vyberte počasie</option>
                  <option value="slnecno">Slnečno</option>
                  <option value="oblacno">Oblačno</option>
                  <option value="dazd">Dážď</option>
                  <option value="sneh">Sneh</option>
                  <option value="hmla">Hmla</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Správanie</label>
                <select
                  name="behavior"
                  value={formData.behavior}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Vyberte správanie</option>
                  <option value="lov">Lov</option>
                  <option value="odpocinek">Odpočinok</option>
                  <option value="pohyb">Pohyb</option>
                  <option value="krmenie">Kŕmenie</option>
                  <option value="hra">Hra</option>
                  <option value="teritorialne">Teritoriálne správanie</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center">
              <User className="w-6 h-6 mr-3" />
              Kontaktné údaje
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meno a priezvisko *</label>
                <input
                  type="text"
                  name="photographer"
                  value={formData.photographer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Vaše meno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="vas@email.com"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Automatické zverejnenie</p>
                  <p>Ako oprávnený používateľ sa vaše pozorovania automaticky zverejnia v galérii po odoslaní.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Odosielam..." : "Odoslať pozorovanie"}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              * Povinné polia. Pozorovanie sa automaticky zverejní v galérii.
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
