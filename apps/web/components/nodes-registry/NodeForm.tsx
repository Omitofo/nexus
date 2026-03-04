// Create / edit supply chain node form.
// Phase 4 — connects to the nodes API.
"use client"
import { useState } from "react"
import { CreateNodeSchema, type CreateNodeInput } from "@nexus/shared"
import { nodeApi } from "@/lib/api/nodes"
import { useUIStore } from "@/lib/store/uiStore"
import { NODE_TYPE_LABELS, CERTIFICATION_OPTIONS } from "@/lib/utils/constants"
import { Button } from "@/components/ui/Button"

const NODE_TYPES = Object.keys(NODE_TYPE_LABELS)

const FIELD_CLASS =
  "w-full bg-panel border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm " +
  "text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-blue transition-colors font-mono"

const LABEL_CLASS = "block text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1.5"

export function NodeForm({ onSuccess }: { onSuccess?: () => void }) {
  const { closeCreateNode, addToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])

  const [form, setForm] = useState({
    type: "TRADER" as CreateNodeInput["type"],
    name: "",
    companyName: "",
    country: "",
    reputationScore: "80",
    insuranceClass: "P&I Class A",
    regulatoryRating: "80",
    rfqEmail: "",
    rfqWebhookUrl: "",
    notes: "",
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: "" }))
  }

  function toggleCert(cert: string) {
    setSelectedCerts(c =>
      c.includes(cert) ? c.filter(x => x !== cert) : [...c, cert]
    )
  }

  async function handleSubmit() {
    const input: CreateNodeInput = {
      type: form.type,
      name: form.name,
      companyName: form.companyName,
      country: form.country.toUpperCase().slice(0, 2),
      reputationScore: Number(form.reputationScore),
      insuranceClass: form.insuranceClass,
      certifications: selectedCerts,
      regulatoryRating: Number(form.regulatoryRating),
      rfqEmail: form.rfqEmail,
      rfqWebhookUrl: form.rfqWebhookUrl || null,
      notes: form.notes || null,
    }

    const parsed = CreateNodeSchema.safeParse(input)
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
      await nodeApi.create(parsed.data)
      addToast({ title: "Node created", body: form.companyName, type: "success" })
      closeCreateNode()
      onSuccess?.()
    } catch {
      addToast({ title: "Error", body: "Failed to create node", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-card my-4"
           style={{ boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div>
            <div className="text-sm font-bold">Add Node</div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">Register a new supply chain participant</div>
          </div>
          <button onClick={closeCreateNode} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-panel text-[var(--text-muted)] hover:text-white transition-colors text-lg">×</button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Node type */}
          <div>
            <label className={LABEL_CLASS}>Node Type</label>
            <div className="grid grid-cols-3 gap-2">
              {NODE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => set("type", type)}
                  className="py-2 rounded-xl text-[10px] font-mono font-bold transition-all border text-center"
                  style={
                    form.type === type
                      ? { color: "#63b3ed", background: "rgba(99,179,237,0.1)", borderColor: "rgba(99,179,237,0.3)" }
                      : { color: "var(--text-muted)", background: "transparent", borderColor: "rgba(255,255,255,0.07)" }
                  }
                >
                  {NODE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Company Name</label>
              <input value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Trafigura" className={FIELD_CLASS} />
              {errors.companyName && <p className="text-[10px] font-mono text-red mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>Node Name</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="LNG Desk" className={FIELD_CLASS} />
              {errors.name && <p className="text-[10px] font-mono text-red mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Country (ISO 2)</label>
              <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="CH" maxLength={2} className={FIELD_CLASS} />
              {errors.country && <p className="text-[10px] font-mono text-red mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>RFQ Email</label>
              <input type="email" value={form.rfqEmail} onChange={e => set("rfqEmail", e.target.value)} placeholder="rfq@company.com" className={FIELD_CLASS} />
              {errors.rfqEmail && <p className="text-[10px] font-mono text-red mt-1">{errors.rfqEmail}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Reputation (0-100)</label>
              <input type="number" min="0" max="100" value={form.reputationScore} onChange={e => set("reputationScore", e.target.value)} className={FIELD_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Regulatory Rating</label>
              <input type="number" min="0" max="100" value={form.regulatoryRating} onChange={e => set("regulatoryRating", e.target.value)} className={FIELD_CLASS} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Insurance Class</label>
            <select value={form.insuranceClass} onChange={e => set("insuranceClass", e.target.value)} className={FIELD_CLASS}>
              {["Lloyds A+", "Lloyds A", "P&I Class A", "P&I Class B", "P&I Class C"].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Certifications</label>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATION_OPTIONS.map(cert => (
                <button
                  key={cert}
                  onClick={() => toggleCert(cert)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all border"
                  style={
                    selectedCerts.includes(cert)
                      ? { color: "#48bb78", background: "rgba(72,187,120,0.1)", borderColor: "rgba(72,187,120,0.3)" }
                      : { color: "var(--text-muted)", background: "transparent", borderColor: "rgba(255,255,255,0.07)" }
                  }
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-5 border-t border-[var(--border)]">
          <Button variant="ghost" onClick={closeCreateNode} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? "Adding..." : "Add Node"}
          </Button>
        </div>
      </div>
    </div>
  )
}
