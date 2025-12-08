'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/pro/admin" },
  { name: "Salespersons", path: "/pro/admin/salespersons" },
  { name: "Leads", path: "/pro/admin/leads" },
  { name: "Reports", path: "/pro/admin/reports" },
  { name: "Settings", path: "/pro/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md h-full">
      <h1 className="text-2xl font-semibold text-center py-6 border-b">
        CRM Admin
      </h1>

      <nav className="mt-4 flex flex-col gap-1">
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
    </div>
  );
}
