// Score widget shown on the bottom-left of the canvas
// when a greedy path has been calculated.
"use client"
import { useGraphStore } from "@/lib/store/graphStore"

export function GreedyScoreOverlay() {
  const { selectedPath } = useGraphStore()

  if (!selectedPath) return null

  const { overallScore, scoreBreakdown, totalCostPerUnit, estimatedDeliveryDays } = selectedPath

  const bars = [
    { label: "Price",      value: scoreBreakdown.price,      color: "#48bb78" },
    { label: "Risk",       value: scoreBreakdown.risk,       color: "#63b3ed" },
    { label: "Compliance", value: scoreBreakdown.compliance, color: "#f6c90e" },
    { label: "Insurance",  value: scoreBreakdown.insurance,  color: "#4fd1c5" },
  ]

  return (
    <div className="absolute bottom-5 left-5 z-10 w-48 rounded-2xl border border-gold/20 bg-void/92 backdrop-blur-xl p-4"
         style={{ boxShadow: "0 0 30px rgba(246,201,14,0.1)" }}>
      <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-widest uppercase mb-2">
        Greedy Score
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-gold leading-none">{overallScore.toFixed(0)}</span>
        <span className="text-sm text-[var(--text-muted)]">/100</span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {bars.map(bar => (
          <div key={bar.label}>
            <div className="flex justify-between text-[9px] font-mono mb-0.5">
              <span className="text-[var(--text-secondary)]">{bar.label}</span>
              <span style={{ color: bar.color }}>{bar.value.toFixed(0)}</span>
            </div>
            <div className="h-1 bg-panel rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${bar.value}%`, background: bar.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-2 flex flex-col gap-1 text-[9px] font-mono">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Total Cost</span>
          <span className="text-gold">${totalCostPerUnit.toFixed(2)}/unit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Est. ETA</span>
          <span>{estimatedDeliveryDays}d</span>
        </div>
      </div>
    </div>
  )
}
