import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in → send straight to dashboard
  if (user) redirect("/dashboard")

  return <>{children}</>
}
