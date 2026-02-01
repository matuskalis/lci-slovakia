import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"

export async function GET() {
  const isAuthorized = await verifyAdminSession()
  return NextResponse.json({ authorized: isAuthorized })
}
