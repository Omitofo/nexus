// Graph canvas state: nodes on canvas, edges, selected path.
import { create } from "zustand"
import type { Node, Edge } from "reactflow"
import type { Chain } from "@nexus/shared"

interface GraphState {
  nodes: Node[]
  edges: Edge[]
  selectedPath: Chain | null
  optimalPaths: Chain[]
  activeTool: "select" | "pan" | "connect" | "disconnect"

  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setSelectedPath: (path: Chain | null) => void
  setOptimalPaths: (paths: Chain[]) => void
  setActiveTool: (tool: GraphState["activeTool"]) => void
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedPath: null,
  optimalPaths: [],
  activeTool: "select",

  setNodes:       (nodes) => set({ nodes }),
  setEdges:       (edges) => set({ edges }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  setOptimalPaths: (paths) => set({ optimalPaths: paths }),
  setActiveTool:   (tool) => set({ activeTool: tool }),
}))
