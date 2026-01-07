"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";

const menu = [
  { name: "Dashboard", path: "/pro/sales/dashboard" },
  { name: "Leads", path: "/pro/sales/leads" },
  { name: "Follow-ups", path: "/pro/sales/follow-ups" },
];

export default function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    pb.authStore.clear();
    router.push("/pro/sales/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-md hidden md:flex flex-col">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center py-6 border-b">
        Sales Panel
      </h1>

      {/* Menu */}
      <nav className="mt-4 flex flex-col gap-1 flex-1">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
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
    </div>
  );
}
