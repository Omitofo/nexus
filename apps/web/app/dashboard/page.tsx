"use client"
import { useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { GraphCanvas } from "@/components/graph/GraphCanvas"

export default function DashboardPage() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/login"
    })
  }, [])

  return (
    <div className="relative w-full h-full">
      <GraphCanvas />
    </div>
  )
}
