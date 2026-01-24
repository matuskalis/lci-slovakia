import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { randomBytes, createHash } from "crypto"

// Generate a secure session token
function generateSessionToken(): string {
  return randomBytes(32).toString("hex")
}

// Hash the token for storage comparison
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const password = formData.get("password") as string

    if (!password) {
      return NextResponse.json({ success: false, message: "Heslo je povinné" }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD env variable is not set")
      return NextResponse.json({ success: false, message: "Konfiguračná chyba servera" }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, message: "Nesprávne heslo" }, { status: 401 })
    }

    // Generate secure session token
    const sessionToken = generateSessionToken()
    const hashedToken = hashToken(sessionToken)

    // Set admin session cookie with secure token
    const cookieStore = await cookies()
    cookieStore.set("admin-session", hashedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    // Store the session token hash in env for validation (in production use Redis/DB)
    // For now, we'll use a simpler approach - store token hash in another cookie for validation
    cookieStore.set("admin-session-check", hashToken(hashedToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return NextResponse.json({ success: true, message: "Prihlásenie úspešné" })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ success: false, message: "Nastala chyba pri prihlasovaní" }, { status: 500 })
  }
}
