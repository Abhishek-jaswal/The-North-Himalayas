'use client';
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Shield } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const handleLogout = () => {
    pb.authStore.clear();
    router.push("/pro/login");
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-violet-500" />
        <span className="text-slate-800 font-semibold text-sm">Admin Panel</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors relative">
          <Bell size={17} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          A
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl text-xs font-medium transition-colors"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
}
