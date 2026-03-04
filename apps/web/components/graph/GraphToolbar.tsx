// Floating toolbar above the canvas for selecting the active tool.
"use client"
import { useGraphStore } from "@/lib/store/graphStore"
import { useUIStore } from "@/lib/store/uiStore"
import { useTenderStore } from "@/lib/store/tenderStore"
import { tenderApi } from "@/lib/api/tenders"

type Tool = "select" | "pan" | "connect" | "disconnect"

const TOOLS: { id: Tool; label: string }[] = [
  { id: "select",     label: "⊕ Select" },
  { id: "pan",        label: "⤢ Pan" },
  { id: "connect",    label: "∿ Connect" },
  { id: "disconnect", label: "⊘ Disconnect" },
]

export function GraphToolbar() {
  const { activeTool, setActiveTool } = useGraphStore()
  const { openCreateTender } = useUIStore()
  const { activeTender } = useTenderStore()
  const { addToast } = useUIStore()

  async function handleBroadcastRfq() {
    if (!activeTender) return
    await tenderApi.broadcastRfq(activeTender.id)
    addToast({ title: "RFQ Broadcast", body: "Quote requests sent to all active nodes", type: "success" })
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-void/90 backdrop-blur-xl border border-[var(--border)] rounded-xl px-2 py-1.5">
      {TOOLS.map(tool => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition-all ${
            activeTool === tool.id
              ? "text-blue bg-blue/10 border border-blue/20"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-panel border border-transparent"
          }`}
        >
          {tool.label}
        </button>
      ))}

      <div className="w-px h-5 bg-[var(--border)] mx-1" />

      <button
        onClick={handleBroadcastRfq}
        disabled={!activeTender}
        className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-panel transition-all disabled:opacity-30 border border-transparent"
      >
        ⟳ Broadcast RFQ
      </button>

      <button
        onClick={openCreateTender}
        className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all"
      >
        + New Tender
      </button>
    </div>
  )
}
