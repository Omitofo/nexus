// Public client portal: companies request LNG/gas rates here.
// No authentication required. Heavily rate-limited on the backend.
"use client"
import { useState } from "react"

export default function PortalPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    companyName: "", email: "", product: "LNG",
    volumeMt: "", deliveryDate: "", deliveryLocation: "",
    website: "" // honeypot - leave empty
  })

  async function handleSubmit() {
    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    await fetch(`${apiUrl}/portal/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, volumeMt: Number(form.volumeMt) }),
    })

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="font-bold text-xl mb-2">Request received</h1>
          <p className="text-[var(--text-secondary)] text-sm">Our team will be in touch shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-[var(--border)] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-7 h-7 rounded-lg border border-blue flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-blue rounded-full" />
          </div>
          <span className="font-bold text-sm tracking-widest">NEXUS</span>
        </div>

        <h1 className="font-bold text-xl mb-1">Request a rate</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Tell us about your gas requirements and we will get back to you with the best available rates.
        </p>

        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-4">
          {[
            { label: "Company Name", key: "companyName", type: "text", placeholder: "Acme Energy S.A." },
            { label: "Email", key: "email", type: "email", placeholder: "procurement@acme.com" },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 tracking-wider uppercase">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-panel border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-blue transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 tracking-wider uppercase">Product</label>
            <select
              value={form.product}
              onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
              className="w-full bg-panel border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue transition-colors"
            >
              <option value="LNG">LNG</option>
              <option value="NG">Natural Gas</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          {[
            { label: "Volume (MT)", key: "volumeMt", type: "number", placeholder: "50000" },
            { label: "Delivery Date", key: "deliveryDate", type: "date", placeholder: "" },
            { label: "Delivery Location", key: "deliveryLocation", type: "text", placeholder: "Barcelona, Spain" },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 tracking-wider uppercase">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full bg-panel border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-blue transition-colors"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue text-void font-bold text-sm rounded-lg py-2.5 transition-all hover:bg-blue/90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send request"}
          </button>
        </div>
      </div>
    </div>
  )
}
