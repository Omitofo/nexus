"use client"
import { useEffect, useState } from "react"
import { tenderApi } from "@/lib/api/tenders"
import { useTenderStore } from "@/lib/store/tenderStore"
import { useUIStore } from "@/lib/store/uiStore"

export function useTenders() {
  const { setTenders, setActiveTender, tenders } = useTenderStore()
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await tenderApi.list()
        if (cancelled) return
        setTenders(data)
        // Auto-select the first tender if none is active
        if (data.length > 0) setActiveTender(data[0])
      } catch {
        if (cancelled) return
        addToast({ title: "Error", body: "Could not load tenders", type: "error" })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { loading, count: tenders.length }
}
