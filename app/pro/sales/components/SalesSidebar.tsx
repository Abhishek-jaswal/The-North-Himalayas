"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu,  LayoutDashboard, Users, PhoneCall, LogOut } from "lucide-react";
import { pb } from "@/app/lib/pocketbase";

const menu = [
  { name: "Dashboard", path: "/pro/sales/dashboard", icon: LayoutDashboard },
  { name: "Leads", path: "/pro/sales/leads", icon: Users },
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
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
        <span className="font-semibold">Sales Panel</span>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64
        bg-gradient-to-b from-[#0F1021] to-[#1B1C3A]
        text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo / Header */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-xl font-semibold tracking-wide">Sales Panel</h1>
        </div>

        {/* Menu */}
        <nav className="mt-6 flex flex-col gap-1 flex-1 px-3">
          {menu.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm
            bg-red-500/90 hover:bg-red-600 rounded-md transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Spacer for mobile */}
      <div className="md:hidden h-14" />
    </>
  );
}
