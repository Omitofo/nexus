// Toast notification component.
"use client"
import { useEffect } from "react"
import { useUIStore } from "@/lib/store/uiStore"

const TYPE_COLORS = {
  info:    "border-blue/30 text-blue",
  success: "border-green/30 text-green",
  warning: "border-gold/30 text-gold",
  error:   "border-red/30 text-red",
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ title, body, type, onRemove }: { title: string; body: string; type: string; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000)
    return () => clearTimeout(timer)
  }, [onRemove])

  return (
    <div className={`pointer-events-auto bg-card border rounded-xl p-3 max-w-xs shadow-xl animate-in slide-in-from-right ${TYPE_COLORS[type as keyof typeof TYPE_COLORS] ?? "border-[var(--border)]"}`}>
      <div className="text-xs font-bold mb-0.5">{title}</div>
      <div className="text-[11px] font-mono text-[var(--text-secondary)]">{body}</div>
    </div>
  )
}
