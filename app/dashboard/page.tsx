"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Camera, MapPin, Calendar, Edit, Trash, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client" // Klient-side Supabase klient

interface Observation {
  id: number
  title: string
  species: string
  location: string
  date: string
  photographer: string
  description: string | null
  image_urls: string[]
  is_public: boolean
  user_id: string
}

export default function DashboardPage() {
  const [userObservations, setUserObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUserAndObservations = async () => {
      setLoading(true)
      setError(null)
      try {
        // Získanie aktuálneho používateľa
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) {
          setError("Pre prístup k tejto stránke sa musíte prihlásiť.")
          setLoading(false)
          return
        }
        setUser(user)

        // Načítanie pozorovaní pre prihláseného používateľa
        // Vďaka RLS politike "Users can view their own observations." sa automaticky filtrujú len pozorovania používateľa
        const { data, error: fetchError } = await supabase
          .from("observations")
          .select("*")
          .order("date", { ascending: false })

        if (fetchError) throw fetchError
        setUserObservations(data || [])
      } catch (err: any) {
        console.error("Error fetching user observations:", err)
        setError(err.message || "Nepodarilo sa načítať vaše pozorovania.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndObservations()

    // Nastavenie listenera pre zmeny autentifikácie
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Ak sa používateľ prihlási/odhlási, znova načítame pozorovania
        fetchUserAndObservations()
      } else {
        setUser(null)
        setUserObservations([])
        setError("Pre prístup k tejto stránke sa musíte prihlásiť.")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("sk-SK", options)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Naozaj chcete vymazať toto pozorovanie?")) return

    setLoading(true)
    try {
      const { error: deleteError } = await supabase.from("observations").delete().eq("id", id)

      if (deleteError) throw deleteError

      setUserObservations(userObservations.filter((obs) => obs.id !== id))
      alert("Pozorovanie bolo úspešne vymazané.")
    } catch (err: any) {
      console.error("Error deleting observation:", err)
      alert(`Chyba pri mazaní pozorovania: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <h3 className="text-xl font-display font-bold text-gray-600 mb-2">Načítavam vaše pozorovania...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="card text-center max-w-md mx-4"
        >
          <h2 className="text-2xl font-display font-bold text-red-600 mb-4">Chyba prístupu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {!user && (
            <a href="/prihlasenie" className="btn-primary">
              Prihlásiť sa
            </a>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-neutral">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Môj Dashboard</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Tu nájdete a môžete spravovať všetky vaše odoslané pozorovania.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userObservations.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-600 mb-2">Zatiaľ nemáte žiadne pozorovania</h3>
            <p className="text-gray-500 mb-6">Začnite pridávať svoje pozorovania a fotografie, aby sa tu zobrazili.</p>
            <a href="/pridat-fotku" className="btn-primary">
              Pridať prvé pozorovanie
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userObservations.map((obs, index) => (
              <motion.div
                key={obs.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card group overflow-hidden"
              >
                <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                  <Image src={obs.image_urls[0] || "/placeholder.svg"} alt={obs.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      {obs.species}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${obs.is_public ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {obs.is_public ? "Verejné" : "Súkromné"}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-2">{obs.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{obs.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {obs.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDisplayDate(obs.date)}
                  </div>
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    {obs.photographer}
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  {/* Tu by ste mohli pridať odkaz na editačnú stránku */}
                  <button className="btn-secondary flex-1 flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Upraviť
                  </button>
                  <button
                    onClick={() => handleDelete(obs.id)}
                    className="btn-outline flex-1 flex items-center justify-center border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Vymazať
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
