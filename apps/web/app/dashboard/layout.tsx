import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { AppShell } from "@/components/layout/AppShell"

// createSupabaseServerClient is now async (it awaits cookies() internally),
// so this layout must also await it before calling getUser().
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, send to login.
  if (!user) redirect("/login")

  return <AppShell>{children}</AppShell>
}