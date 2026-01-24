"use server"

import { createSupabaseAdminClient } from "@/lib/supabase-config"
import { revalidatePath } from "next/cache"
import { requireAdminSession } from "@/lib/admin-auth"

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áäâà]/g, "a")
    .replace(/[éëêè]/g, "e")
    .replace(/[íïîì]/g, "i")
    .replace(/[óöôò]/g, "o")
    .replace(/[úüûù]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/[ñň]/g, "n")
    .replace(/[çč]/g, "c")
    .replace(/[šś]/g, "s")
    .replace(/[žź]/g, "z")
    .replace(/[ďđ]/g, "d")
    .replace(/[ťţ]/g, "t")
    .replace(/[ľĺ]/g, "l")
    .replace(/[ŕř]/g, "r")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function createBlogPost(formData: FormData) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: null, error: auth.error }
    }

    const title = formData.get("title") as string
    const content = (formData.get("content") as string) || ""
    const author = (formData.get("author") as string) || "Admin"
    const category = (formData.get("category") as string) || "Ochrana"
    const image_url = (formData.get("image_url") as string) || null
    const published = formData.get("published") === "on"

    if (!title || title.trim() === "") {
      return { success: null, error: "Názov je povinný" }
    }

    const slug = generateSlug(title)
    const excerpt = content ? content.replace(/<[^>]*>/g, "").substring(0, 200) + "..." : null

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: title.trim(),
        slug,
        content: content || null,
        excerpt,
        author: author || "Admin",
        category: category || "Ochrana",
        image_url: image_url || null,
        published,
      })
      .select()

    if (error) {
      console.error("Supabase error creating blog:", error)
      return { success: null, error: `Chyba databázy: ${error.message}` }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/blog")
    return { success: "Článok bol úspešne vytvorený", error: null }
  } catch (err) {
    console.error("Exception in createBlogPost:", err)
    const errorMessage = err instanceof Error ? err.message : "Neznáma chyba"
    return { success: null, error: `Chyba: ${errorMessage}` }
  }
}

export async function updateBlogPost(formData: FormData) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: null, error: auth.error }
    }

    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const content = (formData.get("content") as string) || ""
    const author = (formData.get("author") as string) || "Admin"
    const category = (formData.get("category") as string) || "Ochrana"
    const image_url = (formData.get("image_url") as string) || null
    const published = formData.get("published") === "on"

    if (!id) {
      return { success: null, error: "ID článku chýba" }
    }

    if (!title || title.trim() === "") {
      return { success: null, error: "Názov je povinný" }
    }

    const slug = generateSlug(title)
    const excerpt = content ? content.replace(/<[^>]*>/g, "").substring(0, 200) + "..." : null

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: title.trim(),
        slug,
        content: content || null,
        excerpt,
        author: author || "Admin",
        category: category || "Ochrana",
        image_url: image_url || null,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Supabase error updating blog:", error)
      return { success: null, error: `Chyba databázy: ${error.message}` }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    return { success: "Článok bol úspešne aktualizovaný", error: null }
  } catch (err) {
    console.error("Exception in updateBlogPost:", err)
    const errorMessage = err instanceof Error ? err.message : "Neznáma chyba"
    return { success: null, error: `Chyba: ${errorMessage}` }
  }
}

export async function deleteBlogPost(formData: FormData) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: null, error: auth.error }
    }

    const id = formData.get("id") as string

    if (!id) {
      return { success: null, error: "ID článku chýba" }
    }

    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting blog:", error)
      return { success: null, error: `Chyba databázy: ${error.message}` }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/blog")
    return { success: "Článok bol úspešne zmazaný", error: null }
  } catch (err) {
    console.error("Exception in deleteBlogPost:", err)
    const errorMessage = err instanceof Error ? err.message : "Neznáma chyba"
    return { success: null, error: `Chyba: ${errorMessage}` }
  }
}

export async function getBlogPosts() {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blogs:", error)
      return []
    }

    return data || []
  } catch (err) {
    console.error("Exception fetching blogs:", err)
    return []
  }
}

export async function toggleBlogPublished(id: string, published: boolean) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: null, error: auth.error }
    }

    const supabase = createSupabaseAdminClient()

    const { error } = await supabase
      .from("blogs")
      .update({ published, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Supabase error toggling publish:", error)
      return { success: null, error: `Chyba: ${error.message}` }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/blog")
    return { success: published ? "Článok publikovaný" : "Článok skrytý", error: null }
  } catch (err) {
    console.error("Exception in toggleBlogPublished:", err)
    return { success: null, error: "Neočakávaná chyba" }
  }
}

export async function getAllPhotos() {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.from("photos").select("*").order("uploaded_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [], error: null }
  } catch (err) {
    return { success: false, error: "Chyba pri načítavaní fotografií", data: [] }
  }
}

export async function deletePhoto(photoId: string) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: false, error: auth.error }
    }

    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("photos").delete().eq("id", photoId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/galeria")
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Chyba pri vymazávaní" }
  }
}

export async function uploadPhotoToGallery(
  fileBuffer: ArrayBuffer,
  filename: string,
  mimeType: string,
  fileSize: number,
  category: string,
  description: string,
  altText: string,
) {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: false, error: auth.error }
    }

    const supabase = createSupabaseAdminClient()

    // Generate unique filename
    const timestamp = Date.now()
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    const storagePath = `${category}/${timestamp}-${cleanFilename}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return { success: false, error: `Chyba pri nahrávaní: ${uploadError.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("photos").getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    const { data, error: dbError } = await supabase
      .from("photos")
      .insert({
        filename: cleanFilename,
        storage_path: storagePath,
        public_url: publicUrl,
        category,
        description: description || altText || cleanFilename,
      })
      .select()

    if (dbError) {
      console.error("Database insert error:", dbError)
      // Try to delete uploaded file
      await supabase.storage.from("photos").remove([storagePath])
      return { success: false, error: `Chyba databázy: ${dbError.message}` }
    }

    revalidatePath("/galeria")
    revalidatePath("/admin/dashboard")
    return { success: true, error: null, data: data?.[0] }
  } catch (err) {
    console.error("Exception in uploadPhotoToGallery:", err)
    const errorMessage = err instanceof Error ? err.message : "Neznáma chyba"
    return { success: false, error: `Chyba: ${errorMessage}` }
  }
}

export async function deleteAllPhotos() {
  try {
    // Verify admin authorization
    const auth = await requireAdminSession()
    if (!auth.authorized) {
      return { success: false, error: auth.error }
    }

    const supabase = createSupabaseAdminClient()

    // Get all photos to delete from storage
    const { data: photos, error: fetchError } = await supabase.from("photos").select("storage_path")

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Delete from storage if paths exist
    if (photos && photos.length > 0) {
      const storagePaths = photos.map((p) => p.storage_path).filter(Boolean)

      if (storagePaths.length > 0) {
        await supabase.storage.from("photos").remove(storagePaths)
      }
    }

    // Delete all from database
    const { error } = await supabase.from("photos").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/galeria")
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Chyba pri vymazávaní" }
  }
}
