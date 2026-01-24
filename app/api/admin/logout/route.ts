import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    cookies().delete("admin-session")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
