"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Grid, Users, Truck, CreditCard, Paperclip, FileText, Handshake, DollarSign, Camera, Plus, Check, Bell, BarChart2, Bot } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("Tenant Admin");
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        if (u.role) {
          setUserRole(u.role);
        }
      } catch (e) {}
    }
  }, []);

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { href: '/', label: 'Dashboard', icon: Grid, roles: ['Tenant Admin', 'Manager', 'Accounts', 'Internal User'] }
      ]
    },
    {
      group: 'Masters',
      items: [
        { href: '/customers', label: 'Customer Master', icon: Users, roles: ['Tenant Admin', 'Internal User', 'Accounts'] },
        { href: '/fleet', label: 'Fleet Vendor Master', icon: Truck, roles: ['Tenant Admin', 'Internal User', 'Accounts'] },
        { href: '/vehicles', label: 'Vehicle Master', icon: CreditCard, roles: ['Tenant Admin', 'Internal User', 'Accounts'] },
        { href: '/drivers', label: 'Driver Master', icon: Users, roles: ['Tenant Admin', 'Internal User', 'Accounts'] },
      ]
    },
    {
      group: 'Trip Lifecycle',
      items: [
        { href: '/trips/indents', label: 'Indent Management', icon: FileText, roles: ['Tenant Admin', 'Internal User', 'Manager'] },
        { href: '/trips/confirmation', label: 'Trip Confirmation Sheet', icon: Paperclip, roles: ['Tenant Admin', 'Internal User'] },
        { href: '/trips/assignment', label: 'Trip Assignment', icon: Handshake, roles: ['Tenant Admin', 'Internal User', 'Manager'] },
        { href: '/trips/advance-payment', label: 'Advance Payment', icon: DollarSign, roles: ['Tenant Admin', 'Accounts'] },
        { href: '/trips/pod', label: 'POD Review', icon: Camera, roles: ['Tenant Admin', 'Internal User'] },
        { href: '/trips/charges', label: 'Additional Charges', icon: Plus, roles: ['Tenant Admin', 'Internal User', 'Accounts'] },
        { href: '/approvals', label: 'Manager Approval', icon: Check, roles: ['Tenant Admin', 'Manager'] },
        { href: '/payments', label: 'Final Payment', icon: DollarSign, roles: ['Tenant Admin', 'Accounts'] },
        { href: '/automation', label: 'Automation Logs', icon: Bot, roles: ['Tenant Admin', 'Manager'] },
      ]
    },
    {
      group: 'System',
      items: [
        { href: '/users', label: 'Team & Users', icon: Users, roles: ['Tenant Admin'] },
        { href: '/reports', label: 'Reports', icon: BarChart2, roles: ['Tenant Admin', 'Manager', 'Accounts'] },
        { href: '/notifications', label: 'Notifications & WhatsApp', icon: Bell, roles: ['Tenant Admin', 'Manager'] },
      ]
    }
  ];

  return (
    <div className="w-[216px] shrink-0 bg-ink text-white flex flex-col h-full border-r border-ink-soft">
      <div className="h-[70px] shrink-0 flex items-center px-[20px] gap-[10px] font-disp font-bold tracking-[0.3px] text-[15px] border-b border-ink-soft mb-2">
        <div className="w-[22px] h-[22px] rounded-[5px] bg-signal flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
            <path d="M2 16h13V7H2v9Zm13 0h4l3-4v-3h-7v7Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
            <circle cx="6" cy="18.5" r="1.6" fill="#fff"/>
            <circle cx="17.5" cy="18.5" r="1.6" fill="#fff"/>
          </svg>
        </div>
        RouteLedger TMS
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {navGroups.map((g, i) => {
          const visibleItems = g.items.filter(item => item.roles.includes(userRole));
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={i}>
              <div className="font-mono text-[10px] tracking-[1.2px] text-white/35 uppercase px-[20px] pt-[14px] pb-[6px]">
                {g.group}
              </div>
              {visibleItems.map((item, j) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={`flex items-center gap-[10px] px-[12px] py-[9px] mx-[12px] my-[2px] text-[13px] font-medium cursor-pointer rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-signal text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-[15px] h-[15px] shrink-0 opacity-85" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User Profile Card at the bottom of the sidebar */}
      <div className="shrink-0 p-4 border-t border-ink-soft mt-auto bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] bg-signal text-[#1B1200] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-white truncate">{user?.name || "Admin"}</div>
            <div className="text-[11px] text-slate-400 truncate mt-[1px]">{user?.role || "Tenant Admin"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
