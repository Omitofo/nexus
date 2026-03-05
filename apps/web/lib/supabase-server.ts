import { createServerClient } from "@supabase/ssr"
import { cookies, type Cookie } from "next/headers"

// Use this in Next.js Server Components to get the current session.
// Never use this in client components — use createSupabaseBrowserClient() instead.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): Cookie[] {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies are read-only.
            // The middleware handles cookie refresh, so this is safe to ignore.
          }
        },
      },
    }
  )
}