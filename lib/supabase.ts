import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const isConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

// Server-side client for authenticated operations (using anon key since service role is for old DB)
export function createSupabaseServerClient() {
  if (!isConfigured) return null
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Export the createClient function for server actions
export { createClient }
