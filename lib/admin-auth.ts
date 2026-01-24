import { cookies } from "next/headers"
import { createHash } from "crypto"

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin-session")?.value
    const sessionCheck = cookieStore.get("admin-session-check")?.value

    if (!sessionToken || !sessionCheck) {
      return false
    }

    // Verify the session token matches the check
    const expectedCheck = hashToken(sessionToken)
    return expectedCheck === sessionCheck
  } catch (error) {
    console.error("Error verifying admin session:", error)
    return false
  }
}

export async function requireAdminSession(): Promise<{ authorized: boolean; error?: string }> {
  const isAuthorized = await verifyAdminSession()

  if (!isAuthorized) {
    return {
      authorized: false,
      error: "Neautorizovaný prístup. Prosím prihláste sa."
    }
  }

  return { authorized: true }
}
