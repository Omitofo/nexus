// Dimmed edge — used for non-selected or alternative paths.
import { EdgeProps, getBezierPath } from "reactflow"

export function DimEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <path
      d={edgePath}
      stroke="rgba(255,255,255,0.08)"
      strokeWidth={1.5}
      fill="none"
      strokeDasharray="4 4"
    />
  )
}
