// Client node component for the React Flow canvas.
import { Handle, Position, NodeProps } from "reactflow"

interface NodeData {
  label: string
  companyName?: string
  score?: number
  price?: string
  status?: "idle" | "sent" | "pending" | "replied" | "declined"
  isOptimalPath?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  replied:  "#48bb78",
  pending:  "#f6c90e",
  sent:     "#63b3ed",
  declined: "#fc5c5c",
  idle:     "#4a5568",
}

export function ClientNode({ data, selected }: NodeProps<NodeData>) {
  const nodeColor = "#fc5c5c"
  const isOnPath = data.isOptimalPath
  const borderColor = isOnPath ? "#fc5c5c" : (selected ? "rgba(99,179,237,0.6)" : "rgba(255,255,255,0.1)")
  const bgColor = isOnPath ? `rgba(252,92,92, 0.12)` : "rgba(22,28,46,0.9)"

  return (
    <div
      className="relative rounded-2xl border transition-all duration-300"
      style={{
        width: 120,
        background: bgColor,
        borderColor: borderColor,
        boxShadow: isOnPath ? `0 0 20px ${nodeColor}40` : "none",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: nodeColor, border: "none", width: 8, height: 8 }} />

      <div className="p-3 text-center">
        {/* Node icon */}
        <div className="text-xl mb-1">🏢</div>

        {/* Score badge */}
        {data.score !== undefined && (
          <div
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mb-1.5 inline-block"
            style={{ background: `${nodeColor}20`, color: nodeColor }}
          >
            {data.score}/100
          </div>
        )}

        {/* Company name */}
        <div className="text-[10px] font-bold leading-tight truncate" style={{ color: nodeColor }}>
          {data.label}
        </div>

        {/* Price or company */}
        {data.price && (
          <div className="text-[9px] font-mono text-[var(--text-secondary)] mt-0.5 truncate">
            {data.price}
          </div>
        )}

        {/* Quote status dot */}
        {data.status && data.status !== "idle" && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[data.status] }} />
            <span className="text-[8px] font-mono uppercase" style={{ color: STATUS_COLORS[data.status] }}>
              {data.status}
            </span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: nodeColor, border: "none", width: 8, height: 8 }} />
    </div>
  )
}
