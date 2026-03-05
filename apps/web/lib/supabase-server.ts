import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CookieOptions } from "@supabase/ssr"

// ⚠️  IMPORTANT: cookies() returns a Promise in Next.js 14+ (App Router).
//    The function MUST be async and cookies() MUST be awaited, otherwise
//    cookieStore is a Promise object — getAll() returns nothing — the
//    Supabase session is never read — getUser() always returns null.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookies are read-only. Safe to ignore.
          }
        },
      },
    }
  )
}