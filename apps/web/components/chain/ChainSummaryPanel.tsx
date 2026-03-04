"use client"
import { useGraphStore } from "@/lib/store/graphStore"
import { ChainTotals } from "./ChainTotals"
import { ChainExport } from "./ChainExport"
import { GreedyBreakdown } from "@/components/greedy/GreedyBreakdown"

export function ChainSummaryPanel() {
  const { selectedPath, optimalPaths, setSelectedPath } = useGraphStore()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="text-[10px] font-mono font-semibold tracking-widest text-[var(--text-muted)] uppercase mb-0.5">
          Chain Analysis
        </div>
        {selectedPath && (
          <div className="flex items-center gap-2 mt-1">
            <div className="text-2xl font-bold text-green">{selectedPath.overallScore.toFixed(0)}</div>
            <div className="text-xs font-mono text-[var(--text-muted)]">/100 optimal score</div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedPath ? (
          <div className="p-4 space-y-4">
            <GreedyBreakdown breakdown={selectedPath.scoreBreakdown} />
            <ChainTotals chain={selectedPath} />
            {optimalPaths.length > 1 && (
              <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Alternative Paths</div>
                <div className="flex flex-col gap-2">
                  {optimalPaths.slice(1).map((alt, i) => (
                    <button key={alt.id} onClick={() => setSelectedPath(alt)}
                      className="w-full text-left p-3 rounded-xl border border-[var(--border)] hover:border-blue/20 bg-card transition-all">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[var(--text-muted)]">Path {i + 2}</span>
                        <span>{alt.overallScore.toFixed(0)}/100</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-4xl mb-4 opacity-20">⬡</div>
            <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
              Select a tender and run the Greedy Algorithm to see the optimal supply chain path
            </p>
          </div>
        )}
      </div>
      {selectedPath && (
        <div className="p-4 border-t border-[var(--border)]"><ChainExport /></div>
      )}
    </div>
  )
}