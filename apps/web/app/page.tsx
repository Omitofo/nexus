"use client"
import { useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export default function RootPage() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      window.location.href = data.session ? "/dashboard" : "/login"
    })
  }, [])
  return null
}