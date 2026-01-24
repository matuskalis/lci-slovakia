import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let deploymentLogId: string | null = null

  try {
    console.log("=== NIGHTLY DEPLOYMENT STARTED ===")

    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization")
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    console.log("Auth check:", {
      hasAuthHeader: !!authHeader,
      hasSecret: !!process.env.CRON_SECRET,
      authMatches: authHeader === expectedAuth,
    })

    if (authHeader !== expectedAuth) {
      console.log("Unauthorized request - auth header mismatch")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Log deployment start
    const supabase = createSupabaseAdminClient()
    const { data: logData, error: logError } = await supabase
      .from("deployment_logs")
      .insert({
        deployment_type: "nightly-cron",
        status: "started",
        message: "Nightly deployment initiated",
      })
      .select("id")
      .single()

    if (logError) {
      console.error("Failed to log deployment start:", logError)
    } else {
      deploymentLogId = logData.id
      console.log("Deployment logged with ID:", deploymentLogId)
    }

    // Get the deploy hook URL from environment variables
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

    console.log("Deploy hook URL check:", {
      hasDeployHookUrl: !!deployHookUrl,
      urlLength: deployHookUrl?.length || 0,
    })

    if (!deployHookUrl) {
      const errorMsg = "VERCEL_DEPLOY_HOOK_URL not configured"
      console.error(errorMsg)

      // Update log with error
      if (deploymentLogId) {
        await supabase
          .from("deployment_logs")
          .update({
            status: "failed",
            message: errorMsg,
            completed_at: new Date().toISOString(),
            error_details: { error: "Missing deploy hook URL" },
          })
          .eq("id", deploymentLogId)
      }

      return NextResponse.json({ error: errorMsg }, { status: 500 })
    }

    console.log("Triggering deployment via webhook...")

    // Trigger deployment
    const deployResponse = await fetch(deployHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Vercel-Cron-Job",
      },
      body: JSON.stringify({
        source: "nightly-cron",
        timestamp: new Date().toISOString(),
        trigger: "automated-nightly-deployment",
      }),
    })

    console.log("Deploy response:", {
      status: deployResponse.status,
      statusText: deployResponse.statusText,
      ok: deployResponse.ok,
    })

    if (!deployResponse.ok) {
      const errorMsg = `Deploy hook failed: ${deployResponse.status} ${deployResponse.statusText}`
      console.error(errorMsg)

      // Update log with error
      if (deploymentLogId) {
        await supabase
          .from("deployment_logs")
          .update({
            status: "failed",
            message: errorMsg,
            completed_at: new Date().toISOString(),
            error_details: {
              status: deployResponse.status,
              statusText: deployResponse.statusText,
            },
          })
          .eq("id", deploymentLogId)
      }

      return NextResponse.json(
        {
          error: "Deploy hook failed",
          status: deployResponse.status,
          statusText: deployResponse.statusText,
        },
        { status: 500 },
      )
    }

    // Parse response
    let deployData
    try {
      deployData = await deployResponse.json()
      console.log("Deploy response data:", deployData)
    } catch (parseError) {
      console.log("Could not parse deploy response as JSON, but request was successful")
      deployData = { message: "Deployment triggered successfully" }
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    // Update log with success
    if (deploymentLogId) {
      await supabase
        .from("deployment_logs")
        .update({
          status: "completed",
          message: "Nightly deployment completed successfully",
          deployment_id: deployData.job?.id || deployData.id || "unknown",
          completed_at: new Date().toISOString(),
          error_details: null,
        })
        .eq("id", deploymentLogId)
    }

    console.log(`=== NIGHTLY DEPLOYMENT COMPLETED (${duration}ms) ===`)

    return NextResponse.json({
      success: true,
      message: "Nightly deployment triggered successfully",
      deploymentId: deployData.job?.id || deployData.id || "unknown",
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      logId: deploymentLogId,
    })
  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.error("=== NIGHTLY DEPLOYMENT ERROR ===", error)

    // Update log with error
    if (deploymentLogId) {
      try {
        const supabase = createSupabaseAdminClient()
        await supabase
          .from("deployment_logs")
          .update({
            status: "failed",
            message: `Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            completed_at: new Date().toISOString(),
            error_details: {
              error: error instanceof Error ? error.message : "Unknown error",
              stack: error instanceof Error ? error.stack : undefined,
            },
          })
          .eq("id", deploymentLogId)
      } catch (logUpdateError) {
        console.error("Failed to update error log:", logUpdateError)
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
        logId: deploymentLogId,
      },
      { status: 500 },
    )
  }
}

// Also handle POST requests for manual testing
export async function POST(request: NextRequest) {
  return GET(request)
}
