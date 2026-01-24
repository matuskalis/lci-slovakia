import { supabaseAdmin } from "./supabase-config"

export async function uploadFileToStorage(
  file: File,
  bucket: string,
  path: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      return { success: false, error: error.message }
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error("Upload helper error:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

export async function deleteFileFromStorage(
  bucket: string,
  path: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path])

    if (error) {
      console.error("Storage delete error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete helper error:", error)
    return { success: false, error: "Failed to delete file" }
  }
}

export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split(".").pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

  return `${sanitizedName}-${timestamp}-${random}.${extension}`
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"]

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File must be JPEG, PNG, WebP, or HEIC" }
  }

  return { valid: true }
}

export function validateObservationForm(formData: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  const species = formData.get("species") as string
  const location = formData.get("location") as string
  const description = formData.get("description") as string

  if (!species || species.trim() === "") {
    errors.push("Druh je povinný")
  }

  if (!location || location.trim() === "") {
    errors.push("Lokalita je povinná")
  }

  if (!description || description.trim() === "") {
    errors.push("Popis je povinný")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function uploadMultipleFiles(
  files: File[],
  bucket: string,
  userId?: string,
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const uploadPromises = files.map(async (file) => {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const filename = generateUniqueFilename(file.name)
      const path = userId ? `${userId}/${filename}` : filename

      const result = await uploadFileToStorage(file, bucket, path)
      if (!result.success) {
        throw new Error(result.error)
      }

      return {
        filename,
        path,
        url: result.url,
        size: file.size,
        type: file.type,
      }
    })

    const results = await Promise.all(uploadPromises)
    return { success: true, data: results }
  } catch (error) {
    console.error("Upload multiple files error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Upload failed" }
  }
}

export async function saveObservationToDatabase(
  formData: FormData,
  uploadedFiles: any[],
  userId?: string,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const species = formData.get("species") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const observationDate = formData.get("observation_date") as string

    // Save to photos table
    const photoInserts = uploadedFiles.map((file) => ({
      title: `${species} - ${location}`,
      description,
      category: species.toLowerCase(),
      species: species,
      location,
      observation_date: observationDate || new Date().toISOString().split("T")[0],
      image_url: file.url,
      file_path: file.path,
      file_size: file.size,
      uploaded_by: userId || "anonymous",
    }))

    const { data, error } = await supabaseAdmin.from("photos").insert(photoInserts).select()

    if (error) {
      console.error("Database save error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Save observation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Save failed" }
  }
}

export function getRedirectUrl(success: boolean, message?: string): string {
  const baseUrl = success ? "/galeria" : "/pridat-fotku"
  const params = new URLSearchParams()

  if (success) {
    params.set("success", "true")
    params.set("message", message || "Pozorovanie bolo úspešne pridané")
  } else {
    params.set("error", "true")
    params.set("message", message || "Nastala chyba pri pridávaní pozorovania")
  }

  return `${baseUrl}?${params.toString()}`
}
