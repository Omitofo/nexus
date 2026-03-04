// Supabase admin client - backend only.
// Uses SERVICE ROLE KEY: bypasses RLS. Trusted server actor.
// NEVER import this into frontend code.
import { createClient } from "@supabase/supabase-js"
import { env } from "./env.js"

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
)
