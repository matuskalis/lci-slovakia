import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const isConfigured = !!(supabaseUrl && supabaseAnonKey)

// Singleton pattern for client-side Supabase client
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
