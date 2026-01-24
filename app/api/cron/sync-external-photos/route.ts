import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"

// External photo sources - you can add Google Drive, Dropbox, etc.
const EXTERNAL_PHOTO_SOURCES = [
  {
    name: "google-drive",
    url: process.env.GOOGLE_DRIVE_FOLDER_URL,
    enabled: !!process.env.GOOGLE_DRIVE_API_KEY,
  },
  {
    name: "dropbox",
    url: process.env.DROPBOX_FOLDER_URL,
    enabled: !!process.env.DROPBOX_ACCESS_TOKEN,
  },
  {
    name: "direct-urls",
    urls: process.env.EXTERNAL_PHOTO_URLS?.split(",") || [],
    enabled: !!process.env.EXTERNAL_PHOTO_URLS,
  },
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let syncLogId: string | null = null

  try {
    console.log("=== EXTERNAL PHOTO SYNC STARTED ===")

    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization")
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expectedAuth) {
      console.log("Unauthorized request - auth header mismatch")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    // Log sync start
    const { data: logData, error: logError } = await supabase
      .from("deployment_logs")
      .insert({
        deployment_type: "photo-sync",
        status: "started",
        message: "External photo sync initiated",
      })
      .select("id")
      .single()

    if (logError) {
      console.error("Failed to log sync start:", logError)
    } else {
      syncLogId = logData.id
      console.log("Sync logged with ID:", syncLogId)
    }

    let totalPhotosProcessed = 0
    let totalPhotosAdded = 0
    const errors: string[] = []

    // Process each external source
    for (const source of EXTERNAL_PHOTO_SOURCES) {
      if (!source.enabled) {
        console.log(`Skipping ${source.name} - not configured`)
        continue
      }

      console.log(`Processing ${source.name}...`)

      try {
        if (source.name === "direct-urls" && "urls" in source) {
          const result = await processDirectUrls(source.urls, supabase)
          totalPhotosProcessed += result.processed
          totalPhotosAdded += result.added
          errors.push(...result.errors)
        }
        // Add more source types here as needed
      } catch (sourceError) {
        const errorMsg = `Error processing ${source.name}: ${sourceError instanceof Error ? sourceError.message : "Unknown error"}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    // Update log with results
    if (syncLogId) {
      await supabase
        .from("deployment_logs")
        .update({
          status: errors.length > 0 ? "completed_with_errors" : "completed",
          message: `Photo sync completed: ${totalPhotosAdded}/${totalPhotosProcessed} photos added`,
          completed_at: new Date().toISOString(),
          error_details: errors.length > 0 ? { errors } : null,
        })
        .eq("id", syncLogId)
    }

    console.log(`=== EXTERNAL PHOTO SYNC COMPLETED (${duration}ms) ===`)

    // If new photos were added, trigger deployment
    if (totalPhotosAdded > 0) {
      console.log("New photos added, triggering deployment...")
      await triggerDeployment()
    }

    return NextResponse.json({
      success: true,
      message: "External photo sync completed",
      stats: {
        processed: totalPhotosProcessed,
        added: totalPhotosAdded,
        errors: errors.length,
      },
      duration: `${duration}ms`,
      logId: syncLogId,
    })
  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.error("=== EXTERNAL PHOTO SYNC ERROR ===", error)

    // Update log with error
    if (syncLogId) {
      try {
        const supabase = createSupabaseAdminClient()
        await supabase
          .from("deployment_logs")
          .update({
            status: "failed",
            message: `Photo sync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            completed_at: new Date().toISOString(),
            error_details: {
              error: error instanceof Error ? error.message : "Unknown error",
              stack: error instanceof Error ? error.stack : undefined,
            },
          })
          .eq("id", syncLogId)
      } catch (logUpdateError) {
        console.error("Failed to update error log:", logUpdateError)
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
        logId: syncLogId,
      },
      { status: 500 },
    )
  }
}

async function processDirectUrls(urls: string[], supabase: any) {
  let processed = 0
  let added = 0
  const errors: string[] = []

  for (const url of urls) {
    try {
      processed++
      console.log(`Processing URL: ${url}`)

      // Extract filename and category from URL
      const urlParts = url.split("/")
      const filename = urlParts[urlParts.length - 1]
      const category = extractCategoryFromUrl(url) || "other"

      // Check if photo already exists
      const { data: existingPhoto } = await supabase
        .from("photos")
        .select("id")
        .eq("original_filename", filename)
        .single()

      if (existingPhoto) {
        console.log(`Photo ${filename} already exists, skipping`)
        continue
      }

      // Download the image
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Generate storage path
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const fileExt = filename.split(".").pop()?.toLowerCase() || "jpg"
      const storagePath = `${category}/${timestamp}-${randomString}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("wildlife-photos")
        .upload(storagePath, uint8Array, {
          contentType: response.headers.get("content-type") || "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("wildlife-photos").getPublicUrl(storagePath)

      // Insert into database
      const insertData = {
        filename: `${timestamp}-${randomString}.${fileExt}`,
        original_filename: filename,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        category: category,
        description: `Imported from external source: ${filename}`,
        alt_text: `${category} photo`,
        file_size: arrayBuffer.byteLength,
        mime_type: response.headers.get("content-type") || "image/jpeg",
      }

      const { error: dbError } = await supabase.from("photos").insert([insertData])

      if (dbError) {
        // Clean up uploaded file
        await supabase.storage.from("wildlife-photos").remove([storagePath])
        throw new Error(`Database error: ${dbError.message}`)
      }

      added++
      console.log(`Successfully added photo: ${filename}`)
    } catch (error) {
      const errorMsg = `Error processing ${url}: ${error instanceof Error ? error.message : "Unknown error"}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }
  }

  return { processed, added, errors }
}

function extractCategoryFromUrl(url: string): string | null {
  const categories = ["medved", "vlk", "rys"]
  const lowerUrl = url.toLowerCase()

  for (const category of categories) {
    if (lowerUrl.includes(category)) {
      return category
    }
  }

  // Try English names
  if (lowerUrl.includes("bear")) return "medved"
  if (lowerUrl.includes("wolf")) return "vlk"
  if (lowerUrl.includes("lynx")) return "rys"

  return null
}

async function triggerDeployment() {
  try {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
    if (!deployHookUrl) {
      console.log("No deploy hook URL configured, skipping deployment")
      return
    }

    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "photo-sync",
        timestamp: new Date().toISOString(),
      }),
    })

    if (response.ok) {
      console.log("Deployment triggered successfully")
    } else {
      console.error("Failed to trigger deployment:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Error triggering deployment:", error)
  }
}

// Also handle POST requests for manual testing
export async function POST(request: NextRequest) {
  return GET(request)
}
