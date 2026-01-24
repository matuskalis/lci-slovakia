import { createSupabaseServerClient } from "@/lib/supabase"

export interface Photo {
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
  created_at: string
  updated_at: string
}

export async function getAllPhotosFromGallery(): Promise<{ success: boolean; data: Photo[]; message?: string }> {
  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.from("photos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching photos:", error)
      return { success: false, data: [], message: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getAllPhotosFromGallery:", error)
    return { success: false, data: [], message: "Chyba pri načítavaní fotografií" }
  }
}

export async function getPhotosByCategory(
  category: string,
): Promise<{ success: boolean; data: Photo[]; message?: string }> {
  try {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching photos by category:", error)
      return { success: false, data: [], message: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getPhotosByCategory:", error)
    return { success: false, data: [], message: "Chyba pri načítavaní fotografií" }
  }
}

export async function deletePhotoFromGallery(photoId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createSupabaseServerClient()

    // Get photo info first
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("storage_path")
      .eq("id", photoId)
      .single()

    if (fetchError || !photo) {
      return { success: false, message: "Fotografia nebola nájdená" }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("wildlife-photos").remove([photo.storage_path])

    if (storageError) {
      console.error("Storage delete error:", storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase.from("photos").delete().eq("id", photoId)

    if (dbError) {
      console.error("Database delete error:", dbError)
      return { success: false, message: dbError.message }
    }

    return { success: true, message: "Fotografia bola vymazaná" }
  } catch (error) {
    console.error("Delete error:", error)
    return { success: false, message: "Chyba pri vymazávaní" }
  }
}

export async function uploadPhotoToStorage(
  file: File,
  category: string,
  description: string,
  altText?: string,
): Promise<{ success: boolean; data?: Photo; message: string }> {
  try {
    const supabase = createSupabaseServerClient()

    // Map display categories to database categories
    const categoryMap: { [key: string]: string } = {
      "medved-hnedy": "medved",
      "vlk-dravy": "vlk",
      "rys-ostrovid": "rys",
      general: "other",
    }

    const dbCategory = categoryMap[category] || category

    // Validate category
    const validCategories = ["medved", "vlk", "rys", "other"]
    if (!validCategories.includes(dbCategory)) {
      return { success: false, message: `Neplatná kategória: ${category}` }
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${dbCategory}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("wildlife-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return { success: false, message: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("wildlife-photos").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return { success: false, message: "Failed to get public URL" }
    }

    // Save to database
    const { data: dbData, error: dbError } = await supabase
      .from("photos")
      .insert({
        filename: fileName,
        original_filename: file.name,
        storage_path: filePath,
        public_url: urlData.publicUrl,
        category: dbCategory,
        description,
        alt_text: altText || description,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up uploaded file
      await supabase.storage.from("wildlife-photos").remove([filePath])
      return { success: false, message: `Database error: ${dbError.message}` }
    }

    return { success: true, data: dbData, message: "Fotografia bola úspešne nahraná" }
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, message: "Neočakávaná chyba" }
  }
}

// Export aliases for backward compatibility
export { getAllPhotosFromGallery as getAllPhotos }
export { deletePhotoFromGallery as deletePhoto }
export { uploadPhotoToStorage as uploadPhoto }
