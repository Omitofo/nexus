"use client"
import { TopNav } from "./TopNav"
import { SidebarLeft } from "./SidebarLeft"
import { SidebarRight } from "./SidebarRight"
import { TenderForm } from "@/components/tenders/TenderForm"
import { useUIStore } from "@/lib/store/uiStore"
import { useTenders } from "@/lib/hooks/useTenders"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCreateTenderOpen } = useUIStore()
  // Loads tenders from API on mount and populates the store
  const { loading } = useTenders()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-void">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside
          className="w-64 shrink-0 flex flex-col border-r border-[var(--border)] overflow-hidden"
          style={{ background: "rgba(7,8,16,0.7)" }}
        >
          <SidebarLeft loading={loading} />
        </aside>

        {/* Main canvas */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>

        {/* Right sidebar */}
        <aside
          className="w-72 shrink-0 flex flex-col border-l border-[var(--border)] overflow-hidden"
          style={{ background: "rgba(7,8,16,0.7)" }}
        >
          <SidebarRight />
        </aside>
      </div>

      {/* Global modals */}
      {isCreateTenderOpen && <TenderForm />}
    </div>
  )
}
