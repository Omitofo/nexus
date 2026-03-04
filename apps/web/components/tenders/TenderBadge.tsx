// Small pill badge showing tender type (REAL vs SANDBOX) and status.
// Used in sidebar list, table rows, and detail headers.
import type { TenderType, TenderStatus } from "@nexus/shared"

interface TenderBadgeProps {
  type?: TenderType
  status?: TenderStatus
}

const STATUS_CONFIG: Record<TenderStatus, { label: string; color: string; bg: string; border: string }> = {
  DRAFT:             { label: "Draft",           color: "#8892aa", bg: "rgba(136,146,170,0.1)", border: "rgba(136,146,170,0.2)" },
  RFQ_SENT:          { label: "RFQ Sent",         color: "#63b3ed", bg: "rgba(99,179,237,0.1)",  border: "rgba(99,179,237,0.2)"  },
  QUOTES_RECEIVING:  { label: "Quotes Receiving", color: "#f6c90e", bg: "rgba(246,201,14,0.1)",  border: "rgba(246,201,14,0.2)"  },
  OPTIMAL_FOUND:     { label: "Optimal Found",    color: "#48bb78", bg: "rgba(72,187,120,0.1)",  border: "rgba(72,187,120,0.2)"  },
  CLOSED:            { label: "Closed",           color: "#4a5568", bg: "rgba(74,85,104,0.1)",   border: "rgba(74,85,104,0.2)"   },
}

export function TenderTypeBadge({ type }: { type: TenderType }) {
  const isReal = type === "REAL"
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold border"
      style={
        isReal
          ? { color: "#63b3ed", background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)" }
          : { color: "#f6c90e", background: "rgba(246,201,14,0.08)", border: "1px dashed rgba(246,201,14,0.3)" }
      }
    >
      {isReal ? "● REAL" : "◌ SANDBOX"}
    </span>
  )
}

export function TenderStatusBadge({ status }: { status: TenderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  )
}

// Combined badge — shows both type and status together
export function TenderBadge({ type, status }: TenderBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {type   && <TenderTypeBadge type={type} />}
      {status && <TenderStatusBadge status={status} />}
    </div>
  )
}
