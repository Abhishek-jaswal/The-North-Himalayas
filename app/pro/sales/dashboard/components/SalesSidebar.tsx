"use client";

import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function SalesSidebar() {
  const router = useRouter();

  const logout = () => {
    pb.authStore.clear();
    router.push("/pro/sales/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-8">Sales Panel</h2>

      <nav className="flex flex-col gap-4">
        <a className="text-gray-700 hover:text-blue-600 cursor-pointer">
          Dashboard
        </a>

        <a className="text-gray-700 hover:text-blue-600 cursor-pointer">
          Leads
        </a>

        <a className="text-gray-700 hover:text-blue-600 cursor-pointer">
          Follow-ups
        </a>

        <button
          onClick={logout}
          className="mt-10 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
