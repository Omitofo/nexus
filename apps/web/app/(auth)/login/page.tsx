"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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

    // Client-side redirect seguro
    router.replace("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="relative w-full max-w-sm transition-all duration-700"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div className="rounded-2xl border p-8 bg-[rgba(11,15,26,0.92)] backdrop-blur-[24px]">
          <h1 className="text-xl font-bold mb-1 text-white">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-7">Sign in to your operator account</p>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@company.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 border outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 border outline-none"
            />

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full rounded-xl py-3 text-sm font-bold text-black bg-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Authenticating..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}