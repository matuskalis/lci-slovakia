import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const tables = {}

    const { count: photosCount } = await supabase.from("photos").select("*", { count: "exact", head: true })

    const { count: blogCount } = await supabase.from("blogs").select("*", { count: "exact", head: true })

    const { count: profilesCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    const { count: observationsCount } = await supabase.from("observations").select("*", { count: "exact", head: true })

    const tablesData = {
      photos: photosCount || 0,
      blogs: blogCount || 0,
      profiles: profilesCount || 0,
      observations: observationsCount || 0,
    }

    const { data: storageFiles } = await supabase.storage.from("wildlife-photos").list()

    const storageData = {
      bucket: "wildlife-photos",
      files: storageFiles?.length || 0,
    }

    return NextResponse.json({
      success: true,
      tables: tablesData,
      storage: storageData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
