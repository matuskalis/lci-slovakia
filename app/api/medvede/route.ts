import { NextResponse } from "next/server"
import { readBearCsv, toPublicCsv } from "@/lib/bear-data"

export const revalidate = 3600

export async function GET() {
  const csv = toPublicCsv(await readBearCsv())

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
