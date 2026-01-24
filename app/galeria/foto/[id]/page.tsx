import { supabaseAdmin } from "@/lib/supabase-config"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Camera } from "lucide-react"

interface Photo {
  id: string
  filename: string
  original_filename: string
  storage_path: string
  public_url: string
  category: "medved" | "vlk" | "rys" | "other"
  description: string
  alt_text: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
  updated_at: string
}

async function getPhoto(id: string): Promise<Photo | null> {
  try {
    const { data: photo, error } = await supabaseAdmin.from("photos").select("*").eq("id", id).single()

    if (error || !photo) {
      return null
    }

    return photo
  } catch (error) {
    console.error("Error fetching photo:", error)
    return null
  }
}

async function getRelatedPhotos(category: string, currentId: string): Promise<Photo[]> {
  try {
    const { data: photos, error } = await supabaseAdmin
      .from("photos")
      .select("*")
      .eq("category", category)
      .neq("id", currentId)
      .limit(6)
      .order("created_at", { ascending: false })

    if (error) {
      return []
    }

    return photos || []
  } catch (error) {
    console.error("Error fetching related photos:", error)
    return []
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    medved: "Brown Bear",
    vlk: "Gray Wolf",
    rys: "Eurasian Lynx",
    other: "Other",
  }
  return labels[category] || category
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown Size"

  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export default async function PhotoDetailPage({ params }: { params: { id: string } }) {
  const photo = await getPhoto(params.id)

  if (!photo) {
    notFound()
  }

  const relatedPhotos = await getRelatedPhotos(photo.category, photo.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/galeria"
            className="inline-flex items-center text-[#5f523b] hover:text-[#44623c] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={photo.public_url || "/placeholder.svg"}
                  alt={photo.alt_text || photo.description}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Photo Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#5f523b] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryLabel(photo.category)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{photo.description}</h1>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Uploaded: {new Date(photo.created_at).toLocaleDateString("en-US")}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Slovakia</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Camera className="h-5 w-5 mr-3" />
                  <span>{photo.original_filename}</span>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">{formatFileSize(photo.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Type:</span>
                  <span className="font-medium">{photo.mime_type || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Name:</span>
                  <span className="font-medium text-xs">{photo.filename}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Photos - updated link to use /galeria/foto/[id] */}
        {relatedPhotos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Photos - {getCategoryLabel(photo.category)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {relatedPhotos.map((relatedPhoto) => (
                <Link
                  key={relatedPhoto.id}
                  href={`/galeria/foto/${relatedPhoto.id}`}
                  className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={relatedPhoto.public_url || "/placeholder.svg"}
                      alt={relatedPhoto.alt_text || relatedPhoto.description}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{relatedPhoto.description}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
