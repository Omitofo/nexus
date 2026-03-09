//apps/web/app/tenders/page.tsx
"use client"
import { useTenderStore } from "@/lib/store/tenderStore"
import { useUIStore } from "@/lib/store/uiStore"
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth"
import { TenderCard } from "@/components/tenders/TenderCard"
import { TenderForm } from "@/components/tenders/TenderForm"

export default function TendersPage() {
  const { tenders } = useTenderStore()
  const { isCreateTenderOpen, openCreateTender } = useUIStore()
  const { isOperator } = useSupabaseAuth()

  const real    = tenders.filter(t => t.type === "REAL")
  const sandbox = tenders.filter(t => t.type === "SANDBOX")

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Tender Management
          </div>
          <h1 className="text-2xl font-bold">Tenders</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {tenders.length} total · {real.length} real · {sandbox.length} sandbox
          </p>
        </div>
        {isOperator && (
          <button
            onClick={openCreateTender}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, #63b3ed, #4299e1)",
              color: "#070810",
              boxShadow: "0 0 20px rgba(99,179,237,0.2)",
            }}
          >
            + New Tender
          </button>
        )}
      </div>

      {tenders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-5xl opacity-10">≡</div>
          <p className="text-sm font-mono text-[var(--text-muted)]">No tenders yet</p>
          {isOperator && (
            <button
              onClick={openCreateTender}
              className="text-sm font-mono text-blue hover:text-blue/80 underline underline-offset-2 transition-colors"
            >
              Create your first tender →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {real.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                  style={{ color: "#63b3ed", background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)" }}
                >
                  ● REAL
                </div>
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{real.length}</span>
              </div>
              <div className="grid gap-3">
                {real.map(t => <TenderCard key={t.id} tender={t} />)}
              </div>
            </section>
          )}

          {sandbox.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="text-[10px] font-mono font-bold px-2 py-1 rounded"
                  style={{ color: "#f6c90e", background: "rgba(246,201,14,0.08)", border: "1px dashed rgba(246,201,14,0.3)" }}
                >
                  ◌ SANDBOX
                </div>
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{sandbox.length}</span>
              </div>
              <div className="grid gap-3">
                {sandbox.map(t => <TenderCard key={t.id} tender={t} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {isCreateTenderOpen && <TenderForm />}
    </div>
  )
}
