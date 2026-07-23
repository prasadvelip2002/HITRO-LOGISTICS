import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-ink">
      <Sidebar />
      <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 relative z-0">
          {children}
        </div>
      </main>
    </div>
  )
}
