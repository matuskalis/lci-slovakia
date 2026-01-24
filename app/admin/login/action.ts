"use server"

import { cookies } from "next/headers"
import { createSupabaseAdminClient } from "@/lib/supabase-config"
import { revalidatePath } from "next/cache"

// Simple admin authentication
export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string

  if (password !== "LciSk2025") {
    return { success: false, message: "Nesprávne heslo" }
  }

  // Set admin session cookie
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { success: true, message: "Úspešne prihlásený" }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  return { success: true }
}

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}

// Blog post functions
export async function getAllBlogPosts() {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blogs:", error)
      return { success: false, message: "Chyba pri načítavaní príspevkov", data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    return { success: false, message: "Neočakávaná chyba", data: [] }
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createBlogPost(formData: FormData) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { success: false, message: "Neautorizovaný prístup" }
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image_url = formData.get("image_url") as string
    const published = formData.get("published") === "on"

    if (!title) {
      return { success: false, message: "Názov je povinný" }
    }

    const slug = generateSlug(title)
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("blogs").insert({
      slug,
      title,
      content: content || null,
      image_url: image_url || null,
      published,
    })

    if (error) {
      console.error("Error creating blog:", error)
      return { success: false, message: "Chyba pri vytváraní príspevku" }
    }

    revalidatePath("/blog")
    revalidatePath("/")
    revalidatePath(`/blog/${slug}`)

    return { success: true, message: "Príspevok bol úspešne vytvorený" }
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    return { success: false, message: "Neočakávaná chyba" }
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { success: false, message: "Neautorizovaný prístup" }
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image_url = formData.get("image_url") as string
    const published = formData.get("published") === "on" || formData.get("published") === "true"

    if (!title) {
      return { success: false, message: "Názov je povinný" }
    }

    const slug = generateSlug(title)
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase
      .from("blogs")
      .update({
        slug,
        title,
        content: content || null,
        image_url: image_url || null,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating blog:", error)
      return { success: false, message: "Chyba pri aktualizácii príspevku" }
    }

    revalidatePath("/blog")
    revalidatePath("/")
    revalidatePath(`/blog/${slug}`)

    return { success: true, message: "Príspevok bol úspešne aktualizovaný" }
  } catch (error) {
    console.error("Error in updateBlogPost:", error)
    return { success: false, message: "Neočakávaná chyba" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { success: false, message: "Neautorizovaný prístup" }
    }

    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) {
      console.error("Error deleting blog:", error)
      return { success: false, message: "Chyba pri vymazávaní príspevku" }
    }

    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true, message: "Príspevok bol úspešne vymazaný" }
  } catch (error) {
    console.error("Error in deleteBlogPost:", error)
    return { success: false, message: "Neočakávaná chyba" }
  }
}

// Photo management functions (placeholder implementations)
export async function uploadPhotoToGallery(formData: FormData) {
  return { success: false, message: "Photo upload functionality has been removed" }
}

export async function getAllPhotos() {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.from("photos").select("*").order("uploaded_at", { ascending: false })

    if (error) {
      return { success: false, message: "Chyba pri načítavaní fotiek", data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return { success: false, message: "Neočakávaná chyba", data: [] }
  }
}

export async function deletePhoto(id: string) {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { success: false, message: "Neautorizovaný prístup" }
    }

    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.from("photos").delete().eq("id", id)

    if (error) {
      return { success: false, message: "Chyba pri vymazávaní fotky" }
    }

    return { success: true, message: "Fotka bola úspešne vymazaná" }
  } catch (error) {
    return { success: false, message: "Neočakávaná chyba" }
  }
}

export async function deleteAllPhotos() {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { success: false, message: "Neautorizovaný prístup" }
    }

    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.from("photos").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      return { success: false, message: "Chyba pri vymazávaní všetkých fotiek" }
    }

    return { success: true, message: "Všetky fotky boli úspešne vymazané" }
  } catch (error) {
    return { success: false, message: "Neočakávaná chyba" }
  }
}
