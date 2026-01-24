"use client"

import { useState, useEffect } from "react"

export default function DatabaseCheck() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/check-database")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Database check error:", error)
      setStatus({ error: "Chyba pri kontrole databázy" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Kontrolujem databázu...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stav databázy</h2>
        <button onClick={checkDatabase} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Obnoviť
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {status?.tables &&
          Object.entries(status.tables).map(([tableName, count]: [string, any]) => (
            <div key={tableName} className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-lg">{tableName}</h3>
              <p className="text-2xl font-bold text-blue-600">{count} záznamov</p>
            </div>
          ))}
      </div>

      {status?.storage && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Supabase Storage</h3>
          <p className="text-sm text-gray-600">Bucket: {status.storage.bucket || "wildlife-photos"}</p>
          <p className="text-sm text-gray-600">Súbory: {status.storage.files || 0}</p>
        </div>
      )}

      {status?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Chyba:</strong> {status.error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Posledná kontrola</h3>
        <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
