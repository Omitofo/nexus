// Quote state: keyed by quote id for fast lookups and updates.
import { create } from "zustand"
import type { Quote } from "@nexus/shared"

interface QuoteState {
  // Map of quoteId -> Quote for quick access
  quotesByTender: Record<string, Quote[]>

  setQuotesForTender: (tenderId: string, quotes: Quote[]) => void
  updateQuote: (quote: Quote) => void
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotesByTender: {},

  setQuotesForTender: (tenderId, quotes) =>
    set(state => ({
      quotesByTender: { ...state.quotesByTender, [tenderId]: quotes }
    })),

  // Called by useRealtimeQuotes when Supabase pushes a change
  updateQuote: (updatedQuote) =>
    set(state => {
      const tenderId = updatedQuote.tenderId
      const existing = state.quotesByTender[tenderId] ?? []
      const index = existing.findIndex(q => q.id === updatedQuote.id)

      let updated: Quote[]
      if (index >= 0) {
        // Update existing quote
        updated = [...existing]
        updated[index] = updatedQuote
      } else {
        // Add new quote
        updated = [...existing, updatedQuote]
      }

      return { quotesByTender: { ...state.quotesByTender, [tenderId]: updated } }
    }),
}))
