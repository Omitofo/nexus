import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Use this in Next.js Server Components to get the current session.
// Never use this in client components — use createSupabaseBrowserClient() instead.
export function createSupabaseServerClient() {
  const cookieStore = cookies()  // ← NO await — this is Next.js 14, cookies() is synchronous here

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookies are read-only.
            // Middleware handles refresh, safe to ignore.
          }
        },
      },
    }
  )
}