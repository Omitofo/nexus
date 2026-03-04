"use client"
import { useGraphStore } from "@/lib/store/graphStore"
import { useUIStore } from "@/lib/store/uiStore"
import { useTenderStore } from "@/lib/store/tenderStore"
import { formatPrice, formatLeadTime } from "@/lib/utils/formatters"

export function ChainExport() {
  const { selectedPath } = useGraphStore()
  const { activeTender } = useTenderStore()
  const { addToast } = useUIStore()

  if (!selectedPath) return null

  function handleCopyText() {
    const lines = [
      "NEXUS Chain Summary",
      "Tender: " + (activeTender?.name ?? "Unknown"),
      "Score: " + selectedPath!.overallScore.toFixed(1) + "/100",
      "Cost: " + formatPrice(selectedPath!.totalCostPerUnit),
      "Lead Time: " + formatLeadTime(selectedPath!.estimatedDeliveryDays),
    ]
    navigator.clipboard.writeText(lines.join("
"))
    addToast({ title: "Copied", body: "Chain summary copied to clipboard", type: "success" })
  }

  function handleDownloadJSON() {
    const data = { tender: activeTender?.name, exportedAt: new Date().toISOString(), chain: selectedPath }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nexus-chain-" + (activeTender?.id ?? "export") + ".json"
    a.click()
    URL.revokeObjectURL(url)
    addToast({ title: "Downloaded", body: "Chain data exported as JSON", type: "success" })
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleCopyText}
        className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-xs font-mono font-semibold text-[var(--text-secondary)] hover:border-blue/30 hover:text-white transition-all">
        Copy
      </button>
      <button onClick={handleDownloadJSON}
        className="flex-1 py-2.5 rounded-xl bg-blue text-void text-xs font-mono font-bold hover:bg-blue/90 transition-all">
        Export JSON
      </button>
    </div>
  )
}