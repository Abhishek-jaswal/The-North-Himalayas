"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Users, PhoneCall, LogOut, TrendingUp } from "lucide-react";
import { pb } from "@/app/lib/pocketbase";

const menu = [
  { name: "Dashboard",  path: "/pro/sales/dashboard",  icon: LayoutDashboard },
  { name: "Leads",      path: "/pro/sales/leads",      icon: Users },
  { name: "Follow-ups", path: "/pro/sales/follow-ups", icon: PhoneCall },
];

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
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0f172a] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">Sales Panel</span>
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0f172a] flex flex-col
          transform transition-transform duration-200 ease-out shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Sales CRM</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Portal</p>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
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

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile spacer */}
      <div className="md:hidden h-14 shrink-0" />
    </>
  );
}
