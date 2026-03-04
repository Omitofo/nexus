import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { AppShell } from "@/components/layout/AppShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware already handles the redirect, but this is a
  // server-side safety net in case middleware is bypassed.
  if (!user) redirect("/login")

  return <AppShell>{children}</AppShell>
}
