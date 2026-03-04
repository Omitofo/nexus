// App-wide constants.

export const NODE_TYPE_LABELS: Record<string, string> = {
  GAS_SOURCE:     "Gas Source",
  TRADER:         "Trader / Broker",
  LIQUEFACTION:   "Liquefaction",
  TRANSPORT:      "Transport",
  REGASIFICATION: "Regasification",
  STORAGE:        "Storage",
}

export const NODE_TYPE_COLORS: Record<string, string> = {
  GAS_SOURCE:     "#f6c90e",
  TRADER:         "#63b3ed",
  LIQUEFACTION:   "#9f7aea",
  TRANSPORT:      "#48bb78",
  REGASIFICATION: "#4fd1c5",
  STORAGE:        "#8892aa",
}

export const NODE_TYPE_EMOJI: Record<string, string> = {
  GAS_SOURCE:     "⛽",
  TRADER:         "📊",
  LIQUEFACTION:   "🧊",
  TRANSPORT:      "🚢",
  REGASIFICATION: "🔥",
  STORAGE:        "🏗️",
}

export const PRODUCTS = ["LNG", "NG", "CNG"] as const
export const CERTIFICATION_OPTIONS = [
  "ISO 9001", "ISO 14001", "EU-ETS", "SOX",
  "MARPOL", "ISM", "ISPS", "Lloyds Register"
]
