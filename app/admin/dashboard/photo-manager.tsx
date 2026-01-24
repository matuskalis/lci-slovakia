"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Upload, Eye, X, RefreshCw } from "lucide-react"
import { uploadPhotoToGallery, getAllPhotos, deletePhoto, deleteAllPhotos } from "./actions"
import Image from "next/image"

interface Photo {
  id: string
  filename: string
  original_filename: string
  storage_path: string
  public_url: string
  category: string
  description: string
  alt_text: string
  file_size: number
  mime_type: string
  uploaded_at: string
}

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [altText, setAltText] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const categories = [
    { value: "medved", label: "Medveď hnedý" },
    { value: "vlk", label: "Vlk dravý" },
    { value: "rys", label: "Rys ostrovid" },
  ]

  useEffect(() => {
    loadPhotos()
  }, [])

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const loadPhotos = async () => {
    setLoading(true)
    try {
      const result = await getAllPhotos()
      if (result.success) {
        setPhotos(result.data || [])
      } else {
        showMessage(result.error || "Chyba pri načítavaní", "error")
      }
    } catch (error) {
      showMessage("Chyba pri načítavaní fotografií", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        showMessage("Prosím vyberte obrázok", "error")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        showMessage("Súbor je príliš veľký (max 10MB)", "error")
        return
      }

      setSelectedFile(file)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedFile || !category || !description) {
      showMessage("Prosím vyplňte všetky povinné polia", "error")
      return
    }

    setUploading(true)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()

      const result = await uploadPhotoToGallery(
        arrayBuffer,
        selectedFile.name,
        selectedFile.type,
        selectedFile.size,
        category,
        description,
        altText || description,
      )

      if (result.success) {
        showMessage("Fotografia bola úspešne nahraná!", "success")
        setSelectedFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setCategory("")
        setDescription("")
        setAltText("")
        await loadPhotos()
      } else {
        showMessage(result.error || "Chyba pri nahrávaní", "error")
      }
    } catch (error) {
      showMessage("Chyba pri nahrávaní súboru", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Ste si istí, že chcete vymazať túto fotografiu?")) return

    setLoading(true)
    try {
      const result = await deletePhoto(photoId)
      if (result.success) {
        showMessage("Fotografia bola vymazaná", "success")
        await loadPhotos()
      } else {
        showMessage(result.error || "Chyba pri vymazávaní", "error")
      }
    } catch (error) {
      showMessage("Chyba pri vymazávaní", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAllPhotos = async () => {
    if (!confirm("Ste si istí, že chcete vymazať VŠETKY fotografie?")) return
    if (!confirm("Táto akcia sa nedá vrátiť späť. Pokračovať?")) return

    setLoading(true)
    try {
      const result = await deleteAllPhotos()
      if (result.success) {
        showMessage("Všetky fotografie boli vymazané", "success")
        await loadPhotos()
      } else {
        showMessage(result.error || "Chyba pri vymazávaní", "error")
      }
    } catch (error) {
      showMessage("Chyba pri vymazávaní", "error")
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "N/A"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Správa fotografií</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPhotos} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Obnoviť
          </Button>
          {photos.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteAllPhotos} disabled={loading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Vymazať všetky
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            messageType === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nahrať novú fotografiu</CardTitle>
          <CardDescription>Podporované formáty: JPG, PNG, WebP, GIF (max 10MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Súbor *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategória *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Vyberte kategóriu" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Popis *</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Krátky popis fotografie"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="altText">Alt text (pre prístupnosť)</Label>
                  <Textarea
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Popis pre nevidiacich (voliteľné)"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                {previewUrl ? (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <Label className="mb-2 block">Náhľad</Label>
                    <div className="relative aspect-video bg-white rounded overflow-hidden">
                      <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                    </div>
                    {selectedFile && (
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Názov:</strong> {selectedFile.name}
                        </p>
                        <p>
                          <strong>Veľkosť:</strong> {formatFileSize(selectedFile.size)}
                        </p>
                        <p>
                          <strong>Typ:</strong> {selectedFile.type}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400 h-full flex items-center justify-center">
                    Vyberte súbor pre náhľad
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={uploading || !selectedFile || !category || !description}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Nahráva sa..." : "Nahrať fotografiu"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Fotografie ({photos.length})</CardTitle>
          <CardDescription>Kliknutím na fotografiu zobrazíte detail</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Načítava sa...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Žiadne fotografie. Nahrajte prvú fotografiu vyššie.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-square relative bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <Image
                      src={photo.public_url || "/placeholder.svg?height=200&width=200&query=photo"}
                      alt={photo.alt_text || photo.description || "Photo"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <p className="font-medium text-sm truncate">{photo.description || "Bez popisu"}</p>
                    <p className="text-xs text-gray-500">
                      {categories.find((c) => c.value === photo.category)?.label || photo.category}
                    </p>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-gray-400">{formatDate(photo.uploaded_at)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePhoto(photo.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">{selectedPhoto.description || "Detail fotografie"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="relative aspect-video bg-gray-100 rounded overflow-hidden mb-4">
                <Image
                  src={selectedPhoto.public_url || "/placeholder.svg"}
                  alt={selectedPhoto.alt_text || selectedPhoto.description || "Photo"}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <strong>Kategória:</strong>{" "}
                    {categories.find((c) => c.value === selectedPhoto.category)?.label || selectedPhoto.category}
                  </p>
                  <p>
                    <strong>Popis:</strong> {selectedPhoto.description || "N/A"}
                  </p>
                  <p>
                    <strong>Alt text:</strong> {selectedPhoto.alt_text || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Veľkosť:</strong> {formatFileSize(selectedPhoto.file_size)}
                  </p>
                  <p>
                    <strong>Typ:</strong> {selectedPhoto.mime_type || "N/A"}
                  </p>
                  <p>
                    <strong>Nahraté:</strong> {formatDate(selectedPhoto.uploaded_at)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 break-all">
                  <strong>URL:</strong> {selectedPhoto.public_url}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
