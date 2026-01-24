"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, ImageIcon, FileText, X, Check } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

interface UploadedFile {
  name: string
  url: string
  type: "image" | "document"
  size: number
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

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
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    const uploaded: UploadedFile[] = []

    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { data, error } = await supabase.storage.from("website-assets").upload(filePath, file)

        if (error) {
          console.error("Error uploading file:", error)
          continue
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("website-assets").getPublicUrl(filePath)

        uploaded.push({
          name: file.name,
          url: publicUrl,
          type: file.type.startsWith("image/") ? "image" : "document",
          size: file.size,
        })
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }

    setUploadedFiles((prev) => [...prev, ...uploaded])
    setFiles([])
    setUploading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  return (
    <div className="pt-20 min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-serif font-bold text-forest mb-8">Nahrať súbory</h1>
          <p className="text-gray-600 mb-8">
            Nahrajte obrázky, logá a dokumenty pre webstránku. Podporované formáty: JPG, PNG, GIF, PDF, DOC, DOCX
          </p>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
              dragActive ? "border-forest bg-forest/5" : "border-gray-300 hover:border-forest hover:bg-forest/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Pretiahnite súbory sem alebo kliknite pre výber
            </h3>
            <p className="text-gray-500 mb-4">Maximálna veľkosť súboru: 10MB</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block px-6 py-3">
              Vybrať súbory
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Vybrané súbory ({files.length})</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="w-6 h-6 text-forest" />
                      ) : (
                        <FileText className="w-6 h-6 text-forest" />
                      )}
                      <div>
                        <p className="font-medium text-gray-700">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Nahrávam..." : "Nahrať súbory"}
                </button>
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Nahrané súbory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {file.type === "image" ? (
                          <ImageIcon className="w-6 h-6 text-forest" />
                        ) : (
                          <FileText className="w-6 h-6 text-forest" />
                        )}
                        <div>
                          <p className="font-medium text-gray-700">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>

                    {file.type === "image" && (
                      <div className="mb-3">
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">URL súboru:</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={file.url}
                          readOnly
                          className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1"
                        />
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="px-3 py-1 bg-forest text-white text-xs rounded hover:bg-forest-dark transition-colors duration-200"
                        >
                          Kopírovať
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ako používať nahrané súbory</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Pre obrázky:</strong> Skopírujte URL a použite ho v Image komponentoch alebo ako src atribút.
              </p>
              <p>
                <strong>Pre dokumenty:</strong> Skopírujte URL a použite ho ako href v odkazoch na stiahnutie.
              </p>
              <p>
                <strong>Tip:</strong> Odporúčame používať popisné názvy súborov pre lepšiu organizáciu.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
