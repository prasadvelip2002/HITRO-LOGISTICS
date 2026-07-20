"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Users, Truck, CreditCard, Paperclip, FileText, Handshake, DollarSign, Camera, Plus, Check, Bell, BarChart2 } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { href: '/', label: 'Dashboard', icon: Grid }
      ]
    },
    {
      group: 'Masters',
      items: [
        { href: '/customers', label: 'Customer Master', icon: Users },
        { href: '/fleet', label: 'Fleet Vendor Master', icon: Truck },
        { href: '/vehicles', label: 'Vehicle Master', icon: CreditCard },
      ]
    },
    {
      group: 'Trip Lifecycle',
      items: [
        { href: '/trips/indents', label: 'Indent Management', icon: FileText },
        { href: '/trips/confirmation', label: 'Trip Confirmation Sheet', icon: Paperclip },
        { href: '/trips/assignment', label: 'Trip Assignment', icon: Handshake },
        { href: '/trips/advance-payment', label: 'Advance Payment', icon: DollarSign },
        { href: '/trips/pod', label: 'POD Review', icon: Camera },
        { href: '/trips/charges', label: 'Additional Charges', icon: Plus },
        { href: '/approvals', label: 'Manager Approval', icon: Check },
        { href: '/payments', label: 'Final Payment', icon: DollarSign },
      ]
    },
    {
      group: 'System',
      items: [
        { href: '/reports', label: 'Reports', icon: BarChart2 },
        { href: '/notifications', label: 'Notifications & WhatsApp', icon: Bell },
      ]
    }
  ];

  return (
    <div className="w-[216px] shrink-0 bg-[#16233F] text-white flex flex-col overflow-y-auto border-r border-[#2A3B5C]">

      {navGroups.map((g, i) => (
        <div key={i}>
          <div className="font-mono text-[10px] tracking-[1.2px] text-white/35 uppercase px-[20px] pt-[14px] pb-[6px]">
            {g.group}
          </div>
          {g.items.map((item, j) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={j}
                href={item.href}
                className={`flex items-center gap-[10px] px-[20px] py-[9px] text-[13px] font-medium cursor-pointer border-l-[3px] transition-colors
                  ${isActive 
                    ? 'bg-white/10 text-white border-signal' 
                    : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className="w-[15px] h-[15px] shrink-0 opacity-85" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
