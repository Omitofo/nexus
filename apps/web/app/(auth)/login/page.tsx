"use client"
import { useState, useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
const redirectTo = searchParams.get("redirect") ?? "/dashboard"
  const supabase = createSupabaseBrowserClient()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setMounted(true) }, [])

async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Invalid credentials. Please try again.")
      setLoading(false)
      return
    }

    // Full page reload — guarantees the auth cookie is sent with the
    // next server request before middleware checks it
    window.location.href = redirectTo
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%)" }}
        />
        <svg className="absolute top-8 left-8 opacity-10" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" stroke="#63b3ed" strokeWidth="1" fill="none" />
          <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" stroke="#63b3ed" strokeWidth="0.5" fill="none" />
        </svg>
        <svg className="absolute bottom-8 right-8 opacity-10" width="60" height="60" viewBox="0 0 60 60" fill="none">
          <polygon points="30,3 54,17 54,43 30,57 6,43 6,17" stroke="#f6c90e" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div
        className="relative w-full max-w-sm transition-all duration-700"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div
          className="rounded-2xl border border-[var(--border)] p-8"
          style={{
            background: "rgba(11,15,26,0.92)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 0 1px rgba(99,179,237,0.06), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-9 h-9 rounded-xl border border-blue/30 flex items-center justify-center relative"
              style={{ background: "rgba(99,179,237,0.08)" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polygon points="9,1 16,5 16,13 9,17 2,13 2,5" stroke="#63b3ed" strokeWidth="1.5" fill="rgba(99,179,237,0.15)" />
                <circle cx="9" cy="9" r="2" fill="#63b3ed" />
              </svg>
              <div
                className="absolute inset-0 rounded-xl border border-blue/30"
                style={{ animation: "ping 3s cubic-bezier(0,0,0.2,1) infinite" }}
              />
            </div>
            <div>
              <div className="font-bold text-sm tracking-widest text-white">NEXUS</div>
              <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-wider">SUPPLY CHAIN INTELLIGENCE</div>
            </div>
          </div>

          <h1 className="text-xl font-bold mb-1 text-white">Welcome back</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-7">Sign in to your operator account</p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="operator@company.com"
                autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] border transition-all outline-none font-mono"
                style={{
                  background: "rgba(7,8,16,0.8)",
                  borderColor: email ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.08)",
                  boxShadow: email ? "0 0 0 3px rgba(99,179,237,0.06)" : "none",
                }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] border transition-all outline-none font-mono"
                style={{
                  background: "rgba(7,8,16,0.8)",
                  borderColor: password ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.08)",
                  boxShadow: password ? "0 0 0 3px rgba(99,179,237,0.06)" : "none",
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                style={{ background: "rgba(252,92,92,0.08)", border: "1px solid rgba(252,92,92,0.2)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
                <p className="text-xs font-mono text-red">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full relative rounded-xl py-3 text-sm font-bold tracking-wide transition-all overflow-hidden"
              style={{
                background: loading || !email || !password
                  ? "rgba(99,179,237,0.2)"
                  : "linear-gradient(135deg, #63b3ed, #4299e1)",
                color: loading || !email || !password ? "rgba(99,179,237,0.5)" : "#070810",
                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                boxShadow: !loading && email && password ? "0 0 20px rgba(99,179,237,0.3)" : "none",
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}