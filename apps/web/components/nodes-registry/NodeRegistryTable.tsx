// Searchable, filterable table of all supply chain nodes.
// Phase 4 — connects to the nodes API.
"use client"
import { useState } from "react"
import type { SupplyChainNode } from "@nexus/shared"
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from "@/lib/utils/constants"

interface NodeRegistryTableProps {
  nodes: SupplyChainNode[]
  onSelect?: (node: SupplyChainNode) => void
}

export function NodeRegistryTable({ nodes, onSelect }: NodeRegistryTableProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")

  const filtered = nodes.filter(n => {
    const matchesSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.companyName.toLowerCase().includes(search.toLowerCase()) ||
      n.country.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "ALL" || n.type === typeFilter
    return matchesSearch && matchesType
  })

  const typeOptions = ["ALL", ...Object.keys(NODE_TYPE_LABELS)]

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes..."
          className="flex-1 min-w-48 bg-panel border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-blue transition-colors font-mono"
        />
        <div className="flex gap-1 flex-wrap">
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className="px-3 py-2 rounded-lg text-[10px] font-mono font-semibold transition-all border"
              style={
                typeFilter === type
                  ? {
                      color: type === "ALL" ? "#63b3ed" : NODE_TYPE_COLORS[type],
                      background: type === "ALL" ? "rgba(99,179,237,0.1)" : NODE_TYPE_COLORS[type] + "18",
                      borderColor: type === "ALL" ? "rgba(99,179,237,0.3)" : NODE_TYPE_COLORS[type] + "44",
                    }
                  : { color: "var(--text-muted)", background: "transparent", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              {type === "ALL" ? "All" : NODE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-panel">
              {["Company", "Type", "Country", "Reputation", "Insurance", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm font-mono text-[var(--text-muted)]">
                  No nodes found
                </td>
              </tr>
            ) : (
              filtered.map(node => (
                <tr
                  key={node.id}
                  onClick={() => onSelect?.(node)}
                  className="border-b border-[var(--border)] hover:bg-hover transition-colors cursor-pointer last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold">{node.companyName}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{node.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-bold"
                      style={{
                        color: NODE_TYPE_COLORS[node.type],
                        background: NODE_TYPE_COLORS[node.type] + "18",
                      }}
                    >
                      {NODE_TYPE_LABELS[node.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">{node.country}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-16 bg-panel rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: node.reputationScore + "%",
                            background: node.reputationScore >= 75 ? "#48bb78" : node.reputationScore >= 50 ? "#f6c90e" : "#fc5c5c"
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">{node.reputationScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-[var(--text-secondary)]">{node.insuranceClass}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={"w-1.5 h-1.5 rounded-full " + (node.isActive ? "bg-green" : "bg-[var(--text-muted)]")} />
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                        {node.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] font-mono text-[var(--text-muted)]">
        {filtered.length} of {nodes.length} nodes
      </div>
    </div>
  )
}
