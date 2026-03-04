"use client"
import type { Tender } from "@nexus/shared"
import { TenderTypeBadge, TenderStatusBadge, TenderBadge } from "./TenderBadge"
import { formatDate, formatVolume } from "@/lib/utils/formatters"
import { useTenderStore } from "@/lib/store/tenderStore"

interface TenderCardProps {
  tender: Tender
  compact?: boolean
}

export function TenderCard({ tender, compact = false }: TenderCardProps) {
  const { activeTender, setActiveTender } = useTenderStore()
  const isActive = activeTender?.id === tender.id

  if (compact) {
    return (
      <button
        onClick={() => setActiveTender(tender)}
        className="w-full text-left p-3 rounded-xl border transition-all"
        style={{
          background: isActive ? "rgba(99,179,237,0.05)" : "rgba(22,28,46,0.6)",
          borderColor: isActive ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.07)",
          boxShadow: isActive ? "0 0 12px rgba(99,179,237,0.08)" : "none",
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold truncate pr-2 leading-tight">{tender.name}</span>
          <TenderTypeBadge type={tender.type} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {tender.product} · {formatVolume(tender.volumeMt)}
          </span>
          <TenderStatusBadge status={tender.status} />
        </div>
      </button>
    )
  }

  return (
    <div
      className="p-4 rounded-2xl border transition-all hover:border-[rgba(99,179,237,0.2)] cursor-pointer"
      style={{ background: "rgba(22,28,46,0.7)", borderColor: "rgba(255,255,255,0.07)" }}
      onClick={() => setActiveTender(tender)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-sm leading-tight mb-1.5">{tender.name}</h3>
          <TenderBadge type={tender.type} status={tender.status} />
        </div>
        {tender.greedyScore !== null && (
          <div className="shrink-0 text-center">
            <div className="text-xl font-bold text-[#f6c90e]">{tender.greedyScore.toFixed(0)}</div>
            <div className="text-[9px] font-mono text-[var(--text-muted)]">score</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="text-[var(--text-muted)] mb-0.5">Product</div>
          <div className="font-bold">{tender.product}</div>
        </div>
        <div>
          <div className="text-[var(--text-muted)] mb-0.5">Volume</div>
          <div className="font-bold">{formatVolume(tender.volumeMt)}</div>
        </div>
        <div>
          <div className="text-[var(--text-muted)] mb-0.5">Delivery</div>
          <div className="font-bold">{formatDate(tender.deliveryDate)}</div>
        </div>
      </div>
    </div>
  )
}
