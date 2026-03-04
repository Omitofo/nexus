// Active tender and tender list state.
import { create } from "zustand"
import type { Tender } from "@nexus/shared"

interface TenderState {
  tenders: Tender[]
  activeTender: Tender | null

  setTenders: (tenders: Tender[]) => void
  setActiveTender: (tender: Tender | null) => void
}

export const useTenderStore = create<TenderState>((set) => ({
  tenders: [],
  activeTender: null,

  setTenders:      (tenders) => set({ tenders }),
  setActiveTender: (tender) => set({ activeTender: tender }),
}))
