// Individual tender detail page (Phase 3)
// Shows tender info, quote list, and greedy results for one tender.
"use client"
import { useParams } from "next/navigation"

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">
        Tender Detail
      </div>
      <div className="text-sm font-mono text-[var(--text-secondary)]">
        ID: {id}
      </div>
      <p className="mt-4 text-xs font-mono text-[var(--text-muted)]">
        Full tender detail view — Phase 3
      </p>
    </div>
  )
}
