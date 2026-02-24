"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu, X, LayoutDashboard, Users, Target, BarChart2, Settings, Zap,
} from "lucide-react";

const menu = [
  { name: "Dashboard",    path: "/pro/admin",              icon: LayoutDashboard },
  { name: "Salespersons", path: "/pro/admin/salespersons", icon: Users },
  { name: "Leads",        path: "/pro/admin/leads",        icon: Target },
  { name: "Reports",      path: "/pro/admin/reports",      icon: BarChart2 },
  { name: "Settings",     path: "/pro/admin/settings",     icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0f172a] flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-500 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">CRM Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-300 hover:text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#0f172a] flex flex-col shrink-0
          transform transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">CRM Pro</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold px-3 mb-2">Menu</p>
          {menu.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  active
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] text-slate-600">v1.0 · Admin Portal</p>
        </div>
      </aside>
    </>
  );
}
