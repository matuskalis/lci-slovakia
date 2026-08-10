import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase-config"
import { verifyDownloadToken } from "@/lib/data-request-token"
import { readBearCsv } from "@/lib/bear-data"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const requestId = token ? verifyDownloadToken(token) : null

  if (!requestId) {
    return NextResponse.json({ error: "Odkaz je neplatný alebo vypršal." }, { status: 403 })
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Sťahovanie nie je dostupné." }, { status: 503 })
  }

  const { data: dataRequest } = await supabase
    .from("data_requests")
    .select("id, download_count")
    .eq("id", requestId)
    .single()

  if (!dataRequest) {
    return NextResponse.json({ error: "Odkaz je neplatný alebo vypršal." }, { status: 403 })
  }

  await supabase
    .from("data_requests")
    .update({ downloaded_at: new Date().toISOString(), download_count: dataRequest.download_count + 1 })
    .eq("id", requestId)

  return new NextResponse(await readBearCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="medvede-lesy-sr.csv"',
      "Cache-Control": "no-store",
    },
  })
}
