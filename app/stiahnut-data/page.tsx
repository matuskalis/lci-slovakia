"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function StiahnutDataPage() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<"sent" | "recorded" | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/data-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        email: form.get("email"),
        organization: form.get("organization"),
        purpose: form.get("purpose"),
        consent: form.get("consent") === "on",
      }),
    })

    const payload = await response.json()
    setIsSubmitting(false)

    if (!response.ok && response.status !== 202) {
      setError(payload.error || t("data.request.error"))
      return
    }
    setResult(payload.sent ? "sent" : "recorded")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 to-secondary/5">
      <div className="relative bg-gradient-to-r from-[#5f523b] to-[#44623c] text-white pt-20 pb-8 lg:pt-32 lg:pb-16">
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">{t("data.request.title")}</h1>
          <p className="text-sm lg:text-xl text-white/90 max-w-3xl mx-auto">{t("data.request.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("data.request.terms.title")}</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>{t("data.request.terms.source")}</li>
            <li>{t("data.request.terms.attribution")}</li>
            <li>{t("data.request.terms.noredistribute")}</li>
            <li>{t("data.request.terms.privacy")}</li>
          </ul>
        </div>

        {result ? (
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 text-center">
            <p className="text-gray-700">
              {result === "sent" ? t("data.request.success") : t("data.request.success.manual")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 lg:p-8 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                {t("data.request.name")}
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44623c]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t("data.request.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44623c]"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium mb-1">
                {t("data.request.organization")}
              </label>
              <input
                id="organization"
                name="organization"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44623c]"
              />
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium mb-1">
                {t("data.request.purpose")}
              </label>
              <textarea
                id="purpose"
                name="purpose"
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44623c]"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" name="consent" required className="mt-1 shrink-0" />
              <span>{t("data.request.consent")}</span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#44623c] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-[#3a5333] disabled:opacity-60"
            >
              {isSubmitting ? t("data.request.sending") : t("data.request.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
