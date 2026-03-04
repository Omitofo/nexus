"use client"
import Link from "next/link"
import { useTenderStore } from "@/lib/store/tenderStore"
import { useUIStore } from "@/lib/store/uiStore"
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth"
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from "@/lib/utils/constants"
import { TenderCard } from "@/components/tenders/TenderCard"

const NODE_TYPES = Object.keys(NODE_TYPE_LABELS)

interface SidebarLeftProps {
  loading?: boolean
}

function TenderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1,2,3].map(i => (
        <div
          key={i}
          className="p-3 rounded-xl border border-[var(--border)] animate-pulse"
          style={{ background: "rgba(22,28,46,0.4)", opacity: 1 - i * 0.2 }}
        >
          <div className="h-3 w-3/4 rounded bg-panel mb-2" />
          <div className="h-2 w-1/2 rounded bg-panel" />
        </div>
      ))}
    </div>
  )
}

export function SidebarLeft({ loading = false }: SidebarLeftProps) {
  const { tenders } = useTenderStore()
  const { openCreateTender } = useUIStore()
  const { isOperator } = useSupabaseAuth()

  return (
    <div className="flex flex-col h-full">

      {/* Tenders section */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-semibold tracking-widest text-[var(--text-muted)] uppercase">
            Active Tenders
          </span>
          {isOperator && (
            <button
              onClick={openCreateTender}
              className="text-[10px] font-mono text-blue hover:text-blue/80 transition-colors px-2 py-1 rounded border border-blue/20 hover:border-blue/40 hover:bg-blue/5"
            >
              + New
            </button>
          )}
        </div>

        {loading ? (
          <TenderSkeleton />
        ) : tenders.length === 0 ? (
          <div className="py-6 flex flex-col items-center gap-2">
            <div className="text-2xl opacity-10">≡</div>
            <p className="text-[10px] font-mono text-[var(--text-muted)] text-center leading-relaxed">
              {isOperator ? "No tenders yet. Create one to begin." : "No tenders assigned."}
            </p>
            {isOperator && (
              <button
                onClick={openCreateTender}
                className="mt-1 text-[10px] font-mono text-blue hover:text-blue/80 transition-colors underline underline-offset-2"
              >
                Create your first tender →
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5">
            {tenders.map(tender => (
              <TenderCard key={tender.id} tender={tender} compact />
            ))}
          </div>
        )}
      </div>

      {/* Node type legend */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-semibold tracking-widest text-[var(--text-muted)] uppercase">
            Node Types
          </span>
          {isOperator && (
            <Link
              href="/nodes"
              className="text-[10px] font-mono text-[var(--text-muted)] hover:text-blue transition-colors"
            >
              Manage →
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {NODE_TYPES.map(type => (
            <div
              key={type}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-card transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: NODE_TYPE_COLORS[type],
                  boxShadow: "0 0 6px " + NODE_TYPE_COLORS[type] + "80",
                }}
              />
              <span className="text-[11px] text-[var(--text-secondary)]">{NODE_TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quote tracker */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-[10px] font-mono font-semibold tracking-widest text-[var(--text-muted)] uppercase mb-3">
          Quote Requests
        </div>
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="text-2xl opacity-10">◎</div>
          <p className="text-[10px] font-mono text-[var(--text-muted)] text-center leading-relaxed">
            Select a tender and broadcast RFQ to track live quote status here
          </p>
        </div>
      </div>
    </div>
  )
}
