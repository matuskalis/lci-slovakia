import { NextResponse } from "next/server"
import { readBearCsv, toOpenCsv } from "@/lib/bear-data"

export const revalidate = 3600

export async function GET() {
  const csv = toOpenCsv(await readBearCsv())

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
