import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface Photo {
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

export async function getPhotos(category?: string): Promise<Photo[]> {
  try {
    let query = supabase.from("photos").select("*").order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching photos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error fetching photos:", error)
    return []
  }
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  try {
    const { data, error } = await supabase.from("photos").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching photo:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Error fetching photo:", error)
    return null
  }
}

export async function getPhotoStats() {
  try {
    const { data, error } = await supabase.from("photos").select("category")

    if (error) {
      console.error("[v0] Error fetching photo stats:", error)
      return { total: 0, medved: 0, vlk: 0, rys: 0, other: 0 }
    }

    const stats = data.reduce(
      (acc, photo) => {
        acc.total++
        const category = photo.category
        if (category === "medved") acc.medved++
        else if (category === "vlk") acc.vlk++
        else if (category === "rys") acc.rys++
        else acc.other++
        return acc
      },
      { total: 0, medved: 0, vlk: 0, rys: 0, other: 0 },
    )

    return stats
  } catch (error) {
    console.error("[v0] Error fetching photo stats:", error)
    return { total: 0, medved: 0, vlk: 0, rys: 0, other: 0 }
  }
}
