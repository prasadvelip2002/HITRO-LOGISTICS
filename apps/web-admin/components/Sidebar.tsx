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
    <div className="w-[260px] shrink-0 bg-slate-100 text-slate-600 flex flex-col h-full border-r border-slate-200/80">
      <div className="h-[100px] shrink-0 flex items-center px-4 justify-center mb-2">
        <img src="/logo.png" alt="ADITI TRANS" className="w-full h-[75px] object-contain mix-blend-multiply" />
      </div>

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        {navGroups.map((g, i) => {
          const visibleItems = g.items.filter(item => item.roles.includes(userRole));
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={i}>
              <div className="font-sans text-[11px] tracking-wider text-slate-400 font-semibold uppercase px-6 pt-5 pb-2">
                {g.group}
              </div>
              {visibleItems.map((item, j) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 mx-3 my-1 text-[13.5px] cursor-pointer rounded-md transition-all duration-200
                      ${isActive 
                        ? 'bg-white text-yellow-700 font-semibold shadow-sm ring-1 ring-slate-200/50' 
                        : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 font-medium'
                      }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-yellow-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>


    </div>
  );
}
