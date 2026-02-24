"use client";
import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import Image from "next/image";
import { Sun, CloudSun, Moon } from "lucide-react";

export default function SalesTopbar() {
  const [name, setName] = useState("");

  useEffect(() => {
    if (pb.authStore.isValid) {
      const user = pb.authStore.model;
      setName(user?.name || user?.username || user?.email || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const GreetIcon = hour < 12 ? Sun : hour < 17 ? CloudSun : Moon;

  return (
    <div className="h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <GreetIcon size={15} className="text-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-none">
            {greeting}{name ? `, ${name.split(" ")[0]}` : ""}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Here&apos;s your sales activity today</p>
        </div>
      </div>
      <Image src="/images/logos/logo_5.jpg" alt="Logo" width={48} height={34} className="rounded-lg object-cover" />
    </div>
  );
}
