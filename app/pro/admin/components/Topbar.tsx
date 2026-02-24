"use client";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Topbar() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
    router.push("/pro/login");
  };

  return (
    <div className="h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      {/* Left - Search */}
      <div className="relative hidden sm:flex items-center">
        <Search size={14} className="absolute left-3 text-slate-400" />
        <input
          placeholder="Search anything…"
          className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition w-56"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Live time */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-xs font-bold text-slate-700">{time}</span>
          <span className="text-[10px] text-slate-400">{date}</span>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-100" />

        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
            AD
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden sm:block">Admin</span>
          <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 border border-slate-200 text-xs font-semibold transition-all"
        >
          <LogOut size={13} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
}
