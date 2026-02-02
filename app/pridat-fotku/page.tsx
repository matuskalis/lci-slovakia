"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

export default function AddPhotoPage() {
  const router = useRouter()

  // Redirect to home after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="pt-20 min-h-screen bg-neutral flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="card text-center max-w-md mx-4"
      >
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-primary mb-4">Funkcia nedostupna</h2>
        <p className="text-gray-600 mb-6">
          Pridavanie pozorovani je momentalne dostupne len pre administratorov cez admin panel.
        </p>
        <a href="/" className="btn-primary">
          Spat na hlavnu stranku
        </a>
      </motion.div>
    </div>
  )
}
