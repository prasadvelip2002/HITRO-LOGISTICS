"use client";

import { useState, useEffect } from "react";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="h-[70px] shrink-0 bg-panel border-b border-line flex items-center justify-between px-6 relative z-50">
      <div className="crumb font-disp">
        <div className="font-semibold text-[20px] text-ink leading-tight">Dashboard</div>
        <div className="font-body font-normal text-[13px] text-muted-text mt-[2px]">Overview across all active trips</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-mono text-[11px] font-medium bg-route-soft text-route px-[12px] py-[6px] rounded-[20px] hidden sm:block">
          TENANT: SHREE FREIGHT CARRIERS
        </div>
        
        <button className="flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-slate-100 text-muted-text hover:text-ink transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-alert rounded-full border-2 border-panel"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-line"
          >
            <div className="w-[32px] h-[32px] bg-signal text-[#1B1200] rounded-full flex items-center justify-center font-bold text-[13px]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[12.5px] font-bold text-ink leading-none">{user?.name || "Admin"}</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[110%] w-[200px] bg-white border border-line rounded-[8px] shadow-lg overflow-hidden flex flex-col font-body z-50">
              <div className="px-4 py-3 border-b border-line bg-slate-50">
                <p className="text-[13px] font-bold text-ink">{user?.name || "Admin User"}</p>
                <p className="text-[11px] text-muted-text truncate">{user?.email || "admin@example.com"}</p>
                <div className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">
                  {user?.role || "Tenant Admin"}
                </div>
              </div>
              <button 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-medium text-ink hover:bg-slate-50 transition-colors w-full text-left"
              >
                <User size={14} className="text-muted-text" /> My Profile
              </button>
              <button 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-medium text-ink hover:bg-slate-50 transition-colors w-full text-left border-b border-line"
              >
                <Settings size={14} className="text-muted-text" /> Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-medium text-alert hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
