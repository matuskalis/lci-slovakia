import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let syncLogId: string | null = null

  try {
    console.log("=== GOOGLE DRIVE SYNC STARTED ===")

    // Check authorization
    const authHeader = request.headers.get("authorization")
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expectedAuth) {
      console.log("Unauthorized request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    // Log sync start
    const { data: logData, error: logError } = await supabase
      .from("deployment_logs")
      .insert({
        deployment_type: "google-drive-sync",
        status: "started",
        message: "Google Drive photo sync initiated",
      })
      .select("id")
      .single()

    if (logError) {
      console.error("Failed to log sync start:", logError)
    } else {
      syncLogId = logData.id
      console.log("Sync logged with ID:", syncLogId)
    }

    // Get Google Drive photos
    const photos = await getGoogleDrivePhotos()
    console.log(`Found ${photos.length} photos in Google Drive`)

    let totalPhotosProcessed = 0
    let totalPhotosAdded = 0
    const errors: string[] = []

    // Process each photo
    for (const photo of photos) {
      try {
        totalPhotosProcessed++
        console.log(`Processing: ${photo.name}`)

        // Check if photo already exists
        const { data: existingPhoto } = await supabase
          .from("photos")
          .select("id")
          .eq("original_filename", photo.name)
          .single()

        if (existingPhoto) {
          console.log(`Photo ${photo.name} already exists, skipping`)
          continue
        }

        // Download photo from Google Drive
        const photoData = await downloadGoogleDrivePhoto(photo.id)

        // Determine category from filename
        const category = getCategoryFromFilename(photo.name)

        // Generate storage path
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const fileExt = photo.name.split(".").pop()?.toLowerCase() || "jpg"
        const storagePath = `${category}/${timestamp}-${randomString}.${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("wildlife-photos")
          .upload(storagePath, photoData, {
            contentType: photo.mimeType || "image/jpeg",
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
          original_filename: photo.name,
          storage_path: storagePath,
          public_url: urlData.publicUrl,
          category: category,
          description: `Imported from Google Drive: ${photo.name}`,
          alt_text: `${category} photo`,
          file_size: photoData.byteLength,
          mime_type: photo.mimeType || "image/jpeg",
        }

        const { error: dbError } = await supabase.from("photos").insert([insertData])

        if (dbError) {
          // Clean up uploaded file
          await supabase.storage.from("wildlife-photos").remove([storagePath])
          throw new Error(`Database error: ${dbError.message}`)
        }

        totalPhotosAdded++
        console.log(`Successfully added photo: ${photo.name}`)
      } catch (error) {
        const errorMsg = `Error processing ${photo.name}: ${error instanceof Error ? error.message : "Unknown error"}`
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
          message: `Google Drive sync completed: ${totalPhotosAdded}/${totalPhotosProcessed} photos added`,
          completed_at: new Date().toISOString(),
          error_details: errors.length > 0 ? { errors } : null,
        })
        .eq("id", syncLogId)
    }

    console.log(`=== GOOGLE DRIVE SYNC COMPLETED (${duration}ms) ===`)

    // If new photos were added, trigger deployment
    if (totalPhotosAdded > 0) {
      console.log("New photos added, triggering deployment...")
      await triggerDeployment()
    }

    return NextResponse.json({
      success: true,
      message: "Google Drive sync completed",
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

    console.error("=== GOOGLE DRIVE SYNC ERROR ===", error)

    // Update log with error
    if (syncLogId) {
      try {
        const supabase = createSupabaseAdminClient()
        await supabase
          .from("deployment_logs")
          .update({
            status: "failed",
            message: `Google Drive sync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
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

async function getGoogleDrivePhotos() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!apiKey || !folderId) {
    throw new Error("Google Drive API key or folder ID not configured")
  }

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType,size)`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.files || []
}

async function downloadGoogleDrivePhoto(fileId: string) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download photo: ${response.status} ${response.statusText}`)
  }

  return await response.arrayBuffer()
}

function getCategoryFromFilename(filename: string): string {
  const lowerName = filename.toLowerCase()

  if (lowerName.includes("medved") || lowerName.includes("bear")) return "medved"
  if (lowerName.includes("vlk") || lowerName.includes("wolf")) return "vlk"
  if (lowerName.includes("rys") || lowerName.includes("lynx")) return "rys"

  return "other"
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
        source: "google-drive-sync",
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
