"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExternalUploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    url: "",
    category: "",
    description: "",
    filename: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setMessage("")

    try {
      const response = await fetch("/api/upload-external-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setMessage("✅ Photo uploaded successfully!")
        setFormData({ url: "", category: "", description: "", filename: "" })
      } else {
        setMessage(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload Photo from URL</CardTitle>
            <p className="text-gray-600">Upload photos directly from internet URLs to your wildlife gallery</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="url">Photo URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medved">Medveď hnedý (Brown Bear)</SelectItem>
                    <SelectItem value="vlk">Vlk dravý (Wolf)</SelectItem>
                    <SelectItem value="rys">Rys ostrovid (Lynx)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filename">Custom Filename (optional)</Label>
                <Input
                  id="filename"
                  placeholder="my-photo.jpg"
                  value={formData.filename}
                  onChange={(e) => handleInputChange("filename", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the photo..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>

              {message && (
                <div
                  className={`p-4 rounded-md ${message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">1. Upload from any URL</h3>
              <p className="text-gray-600">Paste any direct image URL (jpg, png, webp, etc.)</p>
            </div>
            <div>
              <h3 className="font-semibold">2. Automatic Processing</h3>
              <p className="text-gray-600">The system downloads, processes, and stores the image automatically</p>
            </div>
            <div>
              <h3 className="font-semibold">3. Nightly Deployment</h3>
              <p className="text-gray-600">
                New photos are automatically published to the website every night at midnight
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
