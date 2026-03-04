// Base button component. Variant-driven.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "gold" | "danger"
  size?: "sm" | "md"
}

const VARIANT_CLASSES = {
  primary: "bg-blue text-void font-bold hover:bg-blue/90",
  ghost:   "border border-[var(--border)] text-[var(--text-secondary)] hover:border-blue/30 hover:text-white",
  gold:    "border border-gold/30 bg-gold/5 text-gold hover:bg-gold/10 hover:border-gold/50",
  danger:  "border border-red/30 bg-red/5 text-red hover:bg-red/10",
}

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
