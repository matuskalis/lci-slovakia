import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isConfigured = !!(supabaseUrl && supabaseAnonKey)

// Client for browser/client-side operations
export const createSupabaseClient = () => {
  if (!isConfigured) return null
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Admin client - uses service role key for elevated privileges (bypasses RLS)
export const createSupabaseAdminClient = () => {
  if (!isConfigured) return null
  const key = supabaseServiceKey || supabaseAnonKey
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Default export for backward compatibility
export const supabaseAdmin = isConfigured ? createSupabaseAdminClient() : null
export const supabase = isConfigured ? createSupabaseClient() : null

// Named exports
export { createClient }
export default createSupabaseClient

// Check if service role key is configured
export const hasAdminAccess = !!supabaseServiceKey
export { isConfigured as isSupabaseConfigured }

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          slug: string
          title: string
          content: string | null
          image_url: string | null
          published: boolean
          category: string | null
          author: string | null
          excerpt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: string | null
          image_url?: string | null
          published?: boolean
          category?: string | null
          author?: string | null
          excerpt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string | null
          image_url?: string | null
          published?: boolean
          category?: string | null
          author?: string | null
          excerpt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          filename: string
          storage_path: string
          public_url: string
          category: "medved" | "vlk" | "rys" | "other"
          description: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          filename: string
          storage_path: string
          public_url: string
          category: "medved" | "vlk" | "rys" | "other"
          description?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          filename?: string
          storage_path?: string
          public_url?: string
          category?: "medved" | "vlk" | "rys" | "other"
          description?: string | null
          uploaded_at?: string
        }
      }
    }
  }
}
