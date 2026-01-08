"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";

export default function SalesTopbar() {
  const [name, setName] = useState<string>("");

 useEffect(() => {
  if (pb.authStore.isValid) {
    const user = pb.authStore.model;
    const displayName = user?.name || user?.username || user?.email || "";
    setName(displayName);
  }
//  eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <div className="bg-white rounded shadow flex items-center justify-between ml-0 md:ml-64 p-4">
      <h3 className="text-xl font-bold ml-8">
        Welcome{name ? `, ${name}` : ""}
      </h3>

      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm">
          Sales Dashboard
        </span>
      </div>
    </div>
  );
}
