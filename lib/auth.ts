import { createSupabaseServerClient } from "@/lib/supabase"

// Pomocná funkcia na overenie, či je používateľ administrátor
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createSupabaseServerClient()
  if (!supabase) return false

  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

  if (error) {
    console.error("Error checking admin role:", error)
    return false
  }

  return data?.role === "admin"
}

// Funkcia na získanie aktuálneho používateľa a jeho roly
export async function getUserWithRole() {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    return { user: null, role: null }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, role: null }
  }

  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return { user, role: null }
  }

  return { user, role: profile?.role || "user" }
}
