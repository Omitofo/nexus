import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { AppShell } from "@/components/layout/AppShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient() // NO await — function is now sync
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return <AppShell>{children}</AppShell>
}