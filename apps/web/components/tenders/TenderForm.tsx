//apps/web/components/tenders/TenderForm.tsx
// Create new tender modal form.
// Validates with Zod before submitting to the API.
"use client"
import { useState } from "react"
import { CreateTenderSchema, type CreateTenderInput } from "@nexus/shared"
import { tenderApi } from "@/lib/api/tenders"
import { useTenderStore } from "@/lib/store/tenderStore"
import { useUIStore } from "@/lib/store/uiStore"
import { Button } from "@/components/ui/Button"

const PRODUCTS = ["LNG", "NG", "CNG"] as const

const FIELD_CLASS =
  "w-full bg-panel border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm " +
  "text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-blue transition-colors font-mono"

export function TenderForm() {
  const { closeCreateTender } = useUIStore()
  const { tenders, setTenders } = useTenderStore()
  const { addToast } = useUIStore()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    type: "SANDBOX" as "REAL" | "SANDBOX",
    name: "",
    product: "LNG" as "LNG" | "NG" | "CNG",
    volumeMt: "",
    deliveryDate: "",
    deliveryLocation: "",
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }

  async function handleSubmit() {
    const input: CreateTenderInput = {
      type:             form.type,
      name:             form.name,
      product:          form.product,
      volumeMt:         Number(form.volumeMt),
      deliveryDate:     new Date(form.deliveryDate).toISOString(),
      deliveryLocation: form.deliveryLocation,
    }

    const parsed = CreateTenderSchema.safeParse(input)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        fieldErrors[key] = (msgs as string[])[0]
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const created = await tenderApi.create(parsed.data)
      setTenders([created, ...tenders])
      addToast({ title: "Tender created", body: created.name, type: "success" })
      closeCreateTender()
    } catch {
      addToast({ title: "Error", body: "Failed to create tender", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-card"
        style={{ boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div>
            <div className="text-sm font-bold">New Tender</div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">Create a supply chain tender</div>
          </div>
          <button
            onClick={closeCreateTender}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-panel text-[var(--text-muted)] hover:text-white transition-colors text-lg"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* REAL / SANDBOX toggle */}
          <div>
            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">
              Tender Type
            </label>
            <div className="flex gap-2">
              {(["REAL", "SANDBOX"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border"
                  style={
                    form.type === t
                      ? t === "REAL"
                        ? { color: "#63b3ed", background: "rgba(99,179,237,0.1)", borderColor: "rgba(99,179,237,0.3)" }
                        : { color: "#f6c90e", background: "rgba(246,201,14,0.08)", borderColor: "rgba(246,201,14,0.3)" }
                      : { color: "var(--text-muted)", background: "transparent", borderColor: "rgba(255,255,255,0.07)" }
                  }
                >
                  {t === "REAL" ? "● REAL" : "◌ SANDBOX"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
              Tender Name
            </label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Q3 LNG Supply — Spain"
              className={FIELD_CLASS}
            />
            {errors.name && <p className="text-[10px] font-mono text-red mt-1">{errors.name}</p>}
          </div>

          {/* Product + Volume row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
                Product
              </label>
              <select
                value={form.product}
                onChange={e => set("product", e.target.value)}
                className={FIELD_CLASS}
              >
                {PRODUCTS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
                Volume (MT)
              </label>
              <input
                type="number"
                value={form.volumeMt}
                onChange={e => set("volumeMt", e.target.value)}
                placeholder="50000"
                className={FIELD_CLASS}
              />
              {errors.volumeMt && <p className="text-[10px] font-mono text-red mt-1">{errors.volumeMt}</p>}
            </div>
          </div>

          {/* Delivery date */}
          <div>
            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
              Delivery Date
            </label>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={e => set("deliveryDate", e.target.value)}
              className={FIELD_CLASS}
            />
            {errors.deliveryDate && <p className="text-[10px] font-mono text-red mt-1">{errors.deliveryDate}</p>}
          </div>

          {/* Delivery location */}
          <div>
            <label className="block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
              Delivery Location
            </label>
            <input
              value={form.deliveryLocation}
              onChange={e => set("deliveryLocation", e.target.value)}
              placeholder="Barcelona, Spain"
              className={FIELD_CLASS}
            />
            {errors.deliveryLocation && <p className="text-[10px] font-mono text-red mt-1">{errors.deliveryLocation}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-5 border-t border-[var(--border)]">
          <Button variant="ghost" onClick={closeCreateTender} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
            style={{ background: form.type === "REAL" ? "#63b3ed" : "#f6c90e", color: "#070810" }}
          >
            {loading ? "Creating..." : `Create ${form.type}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
