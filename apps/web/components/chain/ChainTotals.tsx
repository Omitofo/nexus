import type { Chain } from "@nexus/shared"
import { formatPrice, formatLeadTime } from "@/lib/utils/formatters"

interface ChainTotalsProps { chain: Chain }

function StatItem({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-3 rounded-xl bg-panel border border-[var(--border)]">
      <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-bold font-mono" style={accent ? { color: accent } : undefined}>{value}</div>
    </div>
  )
}

export function ChainTotals({ chain }: ChainTotalsProps) {
  return (
    <div>
      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Totals</div>
      <div className="grid grid-cols-2 gap-2">
        <StatItem label="Total Cost" value={formatPrice(chain.totalCostPerUnit)} accent="#f6c90e" />
        <StatItem label="Nodes" value={String(chain.nodeSequence.length)} />
        <StatItem label="Lead Time" value={formatLeadTime(chain.estimatedDeliveryDays)} />
        <StatItem label="Score" value={chain.overallScore.toFixed(1) + "/100"}
          accent={chain.overallScore >= 75 ? "#48bb78" : chain.overallScore >= 50 ? "#f6c90e" : "#fc5c5c"} />
      </div>
    </div>
  )
}