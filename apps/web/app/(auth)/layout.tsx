import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"

// createSupabaseServerClient is now async (it awaits cookies() internally),
// so this layout must also await it before calling getUser().
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already authenticated, skip the login screen entirely.
  if (user) redirect("/dashboard")

  return <>{children}</>
}