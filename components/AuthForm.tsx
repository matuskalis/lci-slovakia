"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({ email })

      if (error) {
        throw error
      }
      setMessage("Skontrolujte si e-mail pre prihlasovací odkaz!")
    } catch (error: any) {
      setIsError(true)
      setMessage(error.error_description || error.message || "Vyskytla sa chyba pri prihlasovaní.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card max-w-md mx-auto p-8"
    >
      <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">Prihlásenie</h2>
      <p className="text-gray-600 mb-6 text-center">Prihláste sa pomocou magického odkazu na váš e-mail.</p>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              placeholder="vas@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Odosielam...
            </>
          ) : (
            "Odoslať magický odkaz"
          )}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm text-center ${
              isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </motion.div>
  )
}
