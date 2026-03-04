// UI state: modals, active tool, toast notifications.
import { create } from "zustand"

export interface Toast {
  id: string
  title: string
  body: string
  type: "info" | "success" | "warning" | "error"
}

interface UIState {
  toasts: Toast[]
  isCreateTenderOpen: boolean
  isCreateNodeOpen: boolean

  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  openCreateTender: () => void
  closeCreateTender: () => void
  openCreateNode: () => void
  closeCreateNode: () => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isCreateTenderOpen: false,
  isCreateNodeOpen: false,

  addToast: (toast) =>
    set(state => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }]
    })),

  removeToast: (id) =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  openCreateTender: () => set({ isCreateTenderOpen: true }),
  closeCreateTender: () => set({ isCreateTenderOpen: false }),
  openCreateNode: () => set({ isCreateNodeOpen: true }),
  closeCreateNode: () => set({ isCreateNodeOpen: false }),
}))
