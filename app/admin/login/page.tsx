"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("password", password)

      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/dashboard")
      } else {
        setError(data.message || "Nesprávne heslo")
      }
    } catch {
      setError("Nastala chyba pri prihlasovaní")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin prihlásenie</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Prihláste sa do administrátorského panelu</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              Heslo
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Prihlasuje sa..." : "Prihlásiť sa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
