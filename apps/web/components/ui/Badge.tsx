// Badge component for status and type labels.
interface BadgeProps {
  children: React.ReactNode
  color?: "blue" | "gold" | "green" | "red" | "purple" | "cyan" | "muted"
  dashed?: boolean
}

const COLOR_CLASSES = {
  blue:   "bg-blue/10 text-blue border-blue/20",
  gold:   "bg-gold/10 text-gold border-gold/20",
  green:  "bg-green/10 text-green border-green/20",
  red:    "bg-red/10 text-red border-red/20",
  purple: "bg-purple/10 text-purple border-purple/20",
  cyan:   "bg-cyan/10 text-cyan border-cyan/20",
  muted:  "bg-panel text-[var(--text-muted)] border-[var(--border)]",
}

export function Badge({ children, color = "blue", dashed = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${COLOR_CLASSES[color]} ${dashed ? "border-dashed" : ""}`}>
      {children}
    </span>
  )
}
