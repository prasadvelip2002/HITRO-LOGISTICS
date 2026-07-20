import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas text-ink">
      <div className="h-[56px] shrink-0 bg-[#16233F] text-white flex items-center justify-between px-5 border-b border-[#2A3B5C]">
        <div className="flex items-center">
          <div className="flex items-center gap-[10px] font-disp font-bold tracking-[0.3px] text-[15px] mr-10">
            <div className="w-[22px] h-[22px] rounded-[5px] bg-signal flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
                <path d="M2 16h13V7H2v9Zm13 0h4l3-4v-3h-7v7Z" stroke="#1B1200" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="6" cy="18.5" r="1.6" fill="#1B1200"/>
                <circle cx="17.5" cy="18.5" r="1.6" fill="#1B1200"/>
              </svg>
            </div>
            RouteLedger TMS
          </div>
          <div className="flex items-center gap-[12px]">
            <button className="bg-signal text-[#1B1200] font-body font-semibold text-[13px] border-none rounded-[6px] px-[16px] py-[8px] cursor-pointer">
              Web Admin Portal
            </button>
            <button className="bg-transparent border border-white/20 text-white/90 font-body font-medium text-[13px] rounded-[6px] px-[16px] py-[8px] cursor-pointer hover:bg-white/5 transition-colors">
              Mobile Driver App
            </button>
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-[1px] text-white/40 uppercase">
          CLICKABLE PROTOTYPE · NOT PRODUCTION DATA
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
          <div className="h-[70px] shrink-0 bg-panel border-b border-line flex items-center justify-between px-6">
            <div className="crumb font-disp">
              <div className="font-semibold text-[20px] text-ink leading-tight">Dashboard</div>
              <div className="font-body font-normal text-[13px] text-muted-text mt-[2px]">Overview across all active trips</div>
            </div>
            <div className="font-mono text-[11px] font-medium bg-route-soft text-route px-[12px] py-[6px] rounded-[20px]">
              TENANT: SHREE FREIGHT CARRIERS
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
