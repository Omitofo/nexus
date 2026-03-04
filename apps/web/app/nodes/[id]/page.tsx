// Individual node detail page (Phase 4)
// Shows node info, reputation history, certifications, and linked quotes.
"use client"
import { useParams } from "next/navigation"

export default function NodeDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">
        Node Detail
      </div>
      <div className="text-sm font-mono text-[var(--text-secondary)]">
        ID: {id}
      </div>
      <p className="mt-4 text-xs font-mono text-[var(--text-muted)]">
        Full node detail view — Phase 4
      </p>
    </div>
  )
}
