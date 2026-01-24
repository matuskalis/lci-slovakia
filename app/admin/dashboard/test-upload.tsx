"use client"

import type React from "react"

import { useState } from "react"
import { uploadPhotoToGallery } from "./actions"

export default function TestUpload() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)
    setMessage("")

    try {
      const formData = new FormData(event.currentTarget)
      const result = await uploadPhotoToGallery(formData)

      if (result.success) {
        setMessage("Fotografia bola úspešne nahraná!")
        // Reset form
        event.currentTarget.reset()

        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent("photoUploaded"))
      } else {
        setMessage(`Chyba: ${result.error}`)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setMessage("Nastala neočakávaná chyba")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Test Upload</h2>
        <p className="text-gray-600 mb-6">
          Nahrajte testovacie fotografie do galérie. Fotografie sa automaticky zobrazia v príslušných sekciách.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Vyberte fotografiu *
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            required
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Kategória *
          </label>
          <select
            id="category"
            name="category"
            required
            disabled={uploading}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">Vyberte kategóriu</option>
            <option value="medved">Medveď hnedý</option>
            <option value="vlk">Vlk dravý</option>
            <option value="rys">Rys ostrovid</option>
            <option value="other">Ostatné</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Popis *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            disabled={uploading}
            placeholder="Zadajte popis fotografie..."
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-2">
            Alt text (voliteľné)
          </label>
          <input
            type="text"
            id="altText"
            name="altText"
            disabled={uploading}
            placeholder="Alternatívny text pre prístupnosť..."
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Nahrávam...</span>
            </>
          ) : (
            <span>Nahrať fotografiu</span>
          )}
        </button>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes("úspešne")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Poznámky:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Podporované formáty: JPG, PNG, WebP</li>
          <li>• Maximálna veľkosť súboru: 10MB</li>
          <li>• Fotografie sa automaticky optimalizujú</li>
          <li>• Po nahratí sa fotografia zobrazí v príslušnej kategórii</li>
        </ul>
      </div>
    </div>
  )
}
