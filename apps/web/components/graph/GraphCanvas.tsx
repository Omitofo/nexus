// Main graph canvas component using React Flow.
// Renders supply chain nodes and edges for the active tender.
"use client"
import ReactFlow, {
  Background, BackgroundVariant, Controls,
  MiniMap, useNodesState, useEdgesState,
  addEdge, Connection
} from "reactflow"
import "reactflow/dist/style.css"
import { useCallback } from "react"
import { useGraphStore } from "@/lib/store/graphStore"
import { GraphToolbar } from "./GraphToolbar"
import { GreedyScoreOverlay } from "@/components/greedy/GreedyScoreOverlay"
import { GasSourceNode }     from "./nodes/GasSourceNode"
import { TraderNode }        from "./nodes/TraderNode"
import { LiquefactionNode }  from "./nodes/LiquefactionNode"
import { TransportNode }     from "./nodes/TransportNode"
import { RegasNode }         from "./nodes/RegasNode"
import { ClientNode }        from "./nodes/ClientNode"
import { FlowEdge } from "./edges/FlowEdge"
import { DimEdge }  from "./edges/DimEdge"

// Register custom node types. Keys must match the node.type field.
const nodeTypes = {
  GAS_SOURCE:     GasSourceNode,
  TRADER:         TraderNode,
  LIQUEFACTION:   LiquefactionNode,
  TRANSPORT:      TransportNode,
  REGASIFICATION: RegasNode,
  CLIENT:         ClientNode,
}

// Register custom edge types
const edgeTypes = {
  flow: FlowEdge,
  dim:  DimEdge,
}

export function GraphCanvas() {
  const { nodes: storeNodes, edges: storeEdges, setEdges } = useGraphStore()
  const [nodes, , onNodesChange] = useNodesState(storeNodes)
  const [edges, , onEdgesChange] = useEdgesState(storeEdges)

  // Called when user manually draws a connection between two nodes
  const onConnect = useCallback((connection: Connection) => {
    setEdges(addEdge({ ...connection, type: "dim" }, edges))
  }, [edges, setEdges])

  return (
    <div className="w-full h-full relative">
      <GraphToolbar />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
      >
        {/* Grid dot background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={40}
          size={1}
          color="rgba(99, 179, 237, 0.08)"
        />

        {/* Mini map */}
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              GAS_SOURCE: "#f6c90e", TRADER: "#63b3ed",
              LIQUEFACTION: "#9f7aea", TRANSPORT: "#48bb78",
              REGASIFICATION: "#4fd1c5", CLIENT: "#fc5c5c"
            }
            return colors[node.type ?? ""] ?? "#8892aa"
          }}
          style={{ background: "rgba(7,8,16,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
        />
      </ReactFlow>

      {/* Greedy score overlay - bottom left of canvas */}
      <GreedyScoreOverlay />
    </div>
  )
}
