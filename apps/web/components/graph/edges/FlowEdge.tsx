// Animated gold edge — used for the optimal greedy path.
import { EdgeProps, getBezierPath } from "reactflow"

export function FlowEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <g>
      {/* Glow layer */}
      <path d={edgePath} stroke="rgba(246,201,14,0.2)" strokeWidth={6} fill="none" />
      {/* Main animated line */}
      <path
        d={edgePath}
        stroke="#f6c90e"
        strokeWidth={2}
        fill="none"
        strokeDasharray="8 4"
        style={{ animation: "flow 1s linear infinite" }}
      />
      <style>{`
        @keyframes flow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
      `}</style>
    </g>
  )
}
