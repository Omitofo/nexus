// Loading spinner.
interface SpinnerProps { size?: "sm" | "md" | "lg" }
const SIZES = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" }

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div className={`${SIZES[size]} border-2 border-[var(--border)] border-t-blue rounded-full animate-spin`} />
  )
}
