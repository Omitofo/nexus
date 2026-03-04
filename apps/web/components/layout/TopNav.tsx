"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth"
import { useState } from "react"

const NAV_TABS = [
  { label: "Graph",     href: "/dashboard",  icon: "⬡" },
  { label: "Tenders",   href: "/tenders",    icon: "≡" },
  { label: "Nodes",     href: "/nodes",      icon: "◈" },
  { label: "Analytics", href: "/analytics",  icon: "✦" },
]

export function TopNav() {
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useSupabaseAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "?"

  return (
    <nav
      className="h-14 flex items-center gap-4 px-4 border-b border-[var(--border)] shrink-0 z-50 relative"
      style={{ background: "rgba(7,8,16,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0 select-none">
        <div
          className="w-7 h-7 rounded-lg border border-blue/30 flex items-center justify-center"
          style={{ background: "rgba(99,179,237,0.08)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polygon points="7,1 12.5,4 12.5,10 7,13 1.5,10 1.5,4" stroke="#63b3ed" strokeWidth="1.2" fill="rgba(99,179,237,0.15)" />
            <circle cx="7" cy="7" r="1.5" fill="#63b3ed" />
          </svg>
        </div>
        <span className="font-bold text-[11px] tracking-[0.2em] text-white">NEXUS</span>
      </div>

      <div className="w-px h-4 bg-[var(--border)]" />

      {/* Page tabs */}
      <div className="flex items-center gap-0.5">
        {NAV_TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold tracking-wide transition-all"
              style={
                active
                  ? { color: "#63b3ed", background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)" }
                  : { color: "var(--text-muted)", background: "transparent", border: "1px solid transparent" }
              }
            >
              <span className="text-[10px]">{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Live indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold"
          style={{ background: "rgba(72,187,120,0.1)", border: "1px solid rgba(72,187,120,0.2)", color: "#48bb78" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          LIVE
        </div>

        {/* Role badge */}
        {profile && (
          <div
            className="hidden sm:flex items-center px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-widest"
            style={
              profile.role === "operator"
                ? { color: "#f6c90e", background: "rgba(246,201,14,0.08)", border: "1px solid rgba(246,201,14,0.2)" }
                : { color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }
            }
          >
            {profile.role}
          </div>
        )}

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all"
            style={{
              background: "rgba(99,179,237,0.1)",
              border: "1px solid rgba(99,179,237,0.2)",
              color: "#63b3ed",
            }}
            title={user?.email}
          >
            {loading ? "·" : initials}
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              {/* Click-away overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div
                className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-[var(--border)] py-1 overflow-hidden"
                style={{ background: "rgba(11,15,26,0.98)", backdropFilter: "blur(20px)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
              >
                {/* User info */}
                <div className="px-3 py-2.5 border-b border-[var(--border)]">
                  <div className="text-xs font-semibold truncate">{profile?.fullName ?? "Operator"}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] truncate mt-0.5">{user?.email}</div>
                </div>

                {/* Sign out */}
                <button
                  onClick={() => { setUserMenuOpen(false); signOut() }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-mono text-[var(--text-secondary)] hover:text-red hover:bg-red/5 transition-colors"
                >
                  <span className="text-[10px]">⎋</span>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
