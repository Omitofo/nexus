// apps/web/lib/hooks/useRealtimeQuotes.ts

// Subscribes to live quote updates for a tender using Supabase Realtime.
// When any quote row changes in the database, the store is updated
// and the UI re-renders automatically.
// Replaces the old WebSocket approach entirely.
"use client"
import { useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useQuoteStore } from "@/lib/store/quoteStore"
import type { Quote } from "@nexus/shared"

export function useRealtimeQuotes(tenderId: string) {
  const { updateQuote } = useQuoteStore()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    if (!tenderId) return

    // Subscribe to all changes on quotes for this specific tender
    const channel = supabase
      .channel(`quotes:${tenderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",           // INSERT, UPDATE, DELETE
          schema: "public",
          table: "quotes",
          filter: `tender_id=eq.${tenderId}`,
        },
        (payload) => {
          // When a quote changes, update our local store
          if (payload.new) {
            updateQuote(payload.new as Quote)
          }
        }
      )
      .subscribe()

    // Clean up the subscription when component unmounts or tenderId changes
    return () => {
      supabase.removeChannel(channel)
    }
  }, [tenderId])
}
