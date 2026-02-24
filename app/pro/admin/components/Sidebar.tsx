"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu, X, LayoutDashboard, Users, Target,
  BarChart2, Settings, ChevronRight, Activity,
} from "lucide-react";

const menu = [
  { name: "Dashboard",    path: "/pro/admin",              icon: LayoutDashboard, badge: null },
  { name: "Salespersons", path: "/pro/admin/salespersons", icon: Users,           badge: null },
  { name: "Leads",        path: "/pro/admin/leads",        icon: Target,          badge: null },
  { name: "Reports",      path: "/pro/admin/reports",      icon: BarChart2,       badge: null },
  { name: "Settings",     path: "/pro/admin/settings",     icon: Settings,        badge: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Activity size={17} className="text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0c111d]" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] tracking-tight leading-none">CRM Pro</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.15em] mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-4" />

      {/* Nav label */}
      <p className="px-6 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Navigation</p>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-0.5">
        {menu.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative ${
                active
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
              )}
              <Icon size={16} className={`shrink-0 ${active ? "text-amber-400" : "text-slate-600 group-hover:text-slate-300"}`} />
              <span className="text-[13px] font-medium flex-1">{item.name}</span>
              {active
                ? <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                : <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              }
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-5 mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-4" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
            AD
          </div>
          <div>
            <p className="text-slate-300 text-xs font-semibold">Administrator</p>
            <p className="text-slate-600 text-[10px]">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0c111d]/95 backdrop-blur-sm flex items-center justify-between px-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Activity size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">CRM Pro</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#0c111d] z-50 md:hidden transform transition-transform duration-200 ease-out border-r border-slate-800/60 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <X size={18} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 bg-[#0c111d] border-r border-slate-800/60 h-full flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
