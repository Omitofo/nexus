// Animated score breakdown bars for the greedy algorithm result.
// Used in the right sidebar and chain summary panel.
import type { ChainScoreBreakdown } from "@nexus/shared"

interface GreedyBreakdownProps {
  breakdown: ChainScoreBreakdown
}

const BAR_CONFIG: Array<{
  key: keyof ChainScoreBreakdown
  label: string
  color: string
  weight: string
}> = [
  { key: "price",      label: "Price",      color: "#48bb78", weight: "35%" },
  { key: "risk",       label: "Risk",       color: "#63b3ed", weight: "25%" },
  { key: "compliance", label: "Compliance", color: "#f6c90e", weight: "20%" },
  { key: "insurance",  label: "Insurance",  color: "#4fd1c5", weight: "10%" },
  { key: "reputation", label: "Reputation", color: "#9f7aea", weight: "10%" },
]

export function GreedyBreakdown({ breakdown }: GreedyBreakdownProps) {
  return (
    <div>
      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">
        Score Breakdown
      </div>
      <div className="flex flex-col gap-3">
        {BAR_CONFIG.map(({ key, label, color, weight }) => {
          const value = breakdown[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: color, boxShadow: "0 0 6px " + color }}
                  />
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">{label}</span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">({weight})</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-bold font-mono" style={{ color }}>{value.toFixed(0)}</span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">/100</span>
                </div>
              </div>
              <div className="h-1.5 bg-panel rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: value + "%",
                    background: "linear-gradient(90deg, " + color + "88, " + color + ")",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
