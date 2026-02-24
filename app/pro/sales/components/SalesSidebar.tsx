"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Users, PhoneCall, LogOut, TrendingUp, ChevronRight } from "lucide-react";
import { pb } from "@/app/lib/pocketbase";

const menu = [
  { name: "Dashboard", path: "/pro/sales/dashboard", icon: LayoutDashboard },
  { name: "Leads", path: "/pro/sales/leads", icon: Users },
  { name: "Follow-ups", path: "/pro/sales/follow-ups", icon: PhoneCall },
];

// ⭐ Moved OUTSIDE (no logic change)
function SidebarContent({ pathname, setOpen, logout }: { pathname: string; setOpen: (open: boolean) => void; logout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <TrendingUp size={17} className="text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0c111d]" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] tracking-tight leading-none">Sales CRM</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.15em] mt-0.5">My Portal</p>
          </div>
        </div>
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-4" />
      <p className="px-6 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Navigation</p>

      <nav className="flex-1 px-3 space-y-0.5">
        {menu.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative ${active
                ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-indigo-400"
                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full" />
              )}
              <Icon size={16} className={`shrink-0 ${active ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-300"}`} />
              <span className="text-[13px] font-medium flex-1">{item.name}</span>
              {active ? (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              ) : (
                <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 mt-auto">
        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-3" />
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={16} className="shrink-0 group-hover:text-red-400" />
          <span className="text-[13px] font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    pb.authStore.clear();
    router.push("/pro/sales/login");
  };

  return (
    <>
      {/* Mobile bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0c111d]/95 backdrop-blur-sm flex items-center justify-between px-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <TrendingUp size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">Sales CRM</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0c111d] z-50 md:hidden transform transition-transform duration-200 ease-out border-r border-slate-800/60 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
        >
          <X size={18} />
        </button>
        <SidebarContent pathname={pathname} setOpen={setOpen} logout={logout} />
      </div>

      <aside className="hidden md:flex w-[220px] shrink-0 bg-[#0c111d] border-r border-slate-800/60 h-full flex-col">
        <SidebarContent pathname={pathname} setOpen={setOpen} logout={logout} />
      </aside>

      <div className="md:hidden h-14 shrink-0" />
    </>
  );
}