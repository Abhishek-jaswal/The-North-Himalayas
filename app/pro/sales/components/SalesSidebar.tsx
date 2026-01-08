"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { pb } from "@/app/lib/pocketbase";

const menu = [
  { name: "Dashboard", path: "/pro/sales/dashboard" },
  { name: "Leads", path: "/pro/sales/leads" },
  { name: "Follow-ups", path: "/pro/sales/follow-ups" },
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40  border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-md flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:flex`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">Sales Panel</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1 flex-1">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`px-6 py-3 rounded-r-full transition-all ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-14" />
    </>
  );
}
