"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client" // Updated import to use new SSR client pattern
import { Mail, Lock, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // User already exists and is confirmed, but tried to sign up again
        setMessage("Používateľ s týmto e-mailom už existuje. Skúste sa prihlásiť.")
        setIsError(true)
      } else if (data.user && data.user.identities && data.user.identities.length > 0) {
        // New user, email confirmation required
        setMessage("Registrácia úspešná! Skontrolujte si e-mail pre overenie účtu.")
        setIsError(false)
        setEmail("")
        setPassword("")
      } else {
        // This case might happen if email confirmation is off and user is directly signed in
        setMessage("Registrácia úspešná! Presmerovávam na dashboard.")
        setIsError(false)
        router.push("/dashboard")
      }
    } catch (error: any) {
      setIsError(true)
      setMessage(error.error_description || error.message || "Vyskytla sa chyba pri registrácii.")
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
      <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">Registrácia</h2>
      <p className="text-gray-600 mb-6 text-center">Vytvorte si nový účet.</p>

      <form onSubmit={handleRegister} className="space-y-6">
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Heslo
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              type="password"
              placeholder="Vaše heslo (min. 6 znakov)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registrujem...
            </>
          ) : (
            "Zaregistrovať sa"
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
      <p className="mt-6 text-center text-sm text-gray-600">
        Už máte účet?{" "}
        <a href="/prihlasenie" className="text-primary hover:underline">
          Prihláste sa
        </a>
      </p>
    </motion.div>
  )
}
