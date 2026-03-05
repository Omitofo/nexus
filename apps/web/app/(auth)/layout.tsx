import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient() // NO await
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  return <>{children}</>
}