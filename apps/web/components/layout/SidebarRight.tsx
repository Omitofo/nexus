// Right sidebar: chain summary, node details, greedy score, export.
"use client"
import { useGraphStore } from "@/lib/store/graphStore"
import { useGreedy } from "@/lib/hooks/useGreedy"
import { useTenderStore } from "@/lib/store/tenderStore"
import { formatPrice } from "@/lib/utils/formatters"

export function SidebarRight() {
  const { selectedPath } = useGraphStore()
  const { activeTender } = useTenderStore()
  const { runGreedy, loading } = useGreedy(activeTender?.id ?? "")

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Chain Summary</div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
            {activeTender?.name ?? "No tender selected"}
          </div>
        </div>
        {selectedPath && (
          <span className="text-[9px] font-mono font-bold px-2 py-1 rounded bg-green/10 text-green border border-green/20">
            ⚡ OPTIMAL
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Greedy run button */}
        <button
          onClick={runGreedy}
          disabled={loading || !activeTender}
          className="w-full mb-4 py-3 rounded-xl border border-gold/30 bg-gold/5 text-gold text-sm font-bold tracking-wide hover:bg-gold/10 hover:border-gold/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "⟳ Running..." : "⚡ Run Greedy Algorithm"}
        </button>

        {selectedPath ? (
          <>
            {/* Score overlay */}
            <div className="p-4 rounded-xl bg-card border border-gold/20 mb-4">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">
                Greedy Score
              </div>
              <div className="text-4xl font-bold text-gold mb-3">
                {selectedPath.overallScore.toFixed(0)}
                <span className="text-lg text-[var(--text-muted)]">/100</span>
              </div>
              {/* Score breakdown bars */}
              {Object.entries(selectedPath.scoreBreakdown).map(([key, val]) => (
                <div key={key} className="mb-2">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-[var(--text-secondary)] capitalize">{key}</span>
                    <span className="text-[var(--text-primary)]">{(val as number).toFixed(0)}</span>
                  </div>
                  <div className="h-1 bg-panel rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue rounded-full transition-all duration-1000"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-4 rounded-xl bg-card border border-[var(--border)]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-3">
                Chain Totals
              </div>
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Total Cost</span>
                  <span className="text-gold font-bold">{formatPrice(selectedPath.totalCostPerUnit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Nodes in chain</span>
                  <span>{selectedPath.nodeSequence.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Est. Delivery</span>
                  <span>{selectedPath.estimatedDeliveryDays}d</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-3xl mb-3 opacity-30">⬡</div>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Select a tender and run the algorithm to see the optimal chain
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--border)] flex gap-2">
        <button className="flex-1 py-2.5 rounded-xl bg-blue text-void text-xs font-bold tracking-wide hover:bg-blue/90 transition-colors">
          Export Summary
        </button>
        <button className="px-3 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-xs hover:border-blue/30 hover:text-white transition-colors">
          📋
        </button>
      </div>
    </div>
  )
}
