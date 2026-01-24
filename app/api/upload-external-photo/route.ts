import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"

export async function POST(request: NextRequest) {
  try {
    console.log("=== EXTERNAL PHOTO UPLOAD STARTED ===")

    const body = await request.json()
    const { url, category, description, filename } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    const validCategories = ["medved", "vlk", "rys", "other"]
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 },
      )
    }

    const supabase = createSupabaseAdminClient()

    console.log("Downloading image from:", url)

    // Download the image
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Generate filename if not provided
    const originalFilename = filename || url.split("/").pop() || "external-photo.jpg"
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExt = originalFilename.split(".").pop()?.toLowerCase() || "jpg"
    const storagePath = `${category}/${timestamp}-${randomString}.${fileExt}`

    console.log("Uploading to storage:", storagePath)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("wildlife-photos")
      .upload(storagePath, uint8Array, {
        contentType: response.headers.get("content-type") || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    console.log("Upload successful:", uploadData)

    // Get public URL
    const { data: urlData } = supabase.storage.from("wildlife-photos").getPublicUrl(storagePath)

    // Insert into database
    const insertData = {
      filename: `${timestamp}-${randomString}.${fileExt}`,
      original_filename: originalFilename,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      category: category,
      description: description || `Imported from external source: ${originalFilename}`,
      alt_text: `${category} photo`,
      file_size: arrayBuffer.byteLength,
      mime_type: response.headers.get("content-type") || "image/jpeg",
    }

    console.log("Inserting into database:", insertData)

    const { data: dbData, error: dbError } = await supabase.from("photos").insert([insertData]).select().single()

    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up uploaded file
      await supabase.storage.from("wildlife-photos").remove([storagePath])
      throw new Error(`Database error: ${dbError.message}`)
    }

    console.log("=== EXTERNAL PHOTO UPLOAD COMPLETED ===")

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully from external URL",
      data: dbData,
    })
  } catch (error) {
    console.error("=== EXTERNAL PHOTO UPLOAD ERROR ===", error)

    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
