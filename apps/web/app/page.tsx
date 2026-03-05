// app/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}