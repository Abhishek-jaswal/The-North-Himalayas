"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import Image from "next/image";

export default function SalesTopbar() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (pb.authStore.isValid) {
      const user = pb.authStore.model;
      const displayName = user?.name || user?.username || user?.email || "";
      setName(displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
      <div>
        <p className="text-slate-800 font-bold text-sm">
          {greeting}{name ? `, ${name.split(" ")[0]}` : ""} 👋
        </p>
        <p className="text-xs text-slate-400">Here&apos;s what&apos;s happening with your sales today.</p>
      </div>
      <div className="flex items-center gap-3">
        <Image
          src="/images/logos/logo_5.jpg"
          alt="The North Himalayas logo"
          width={52}
          height={36}
          className="rounded-lg object-cover"
        />
      </div>
    </div>
  );
}
