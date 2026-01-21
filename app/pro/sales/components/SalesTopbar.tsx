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
//  eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <div className="bg-white rounded shadow flex items-center justify-between ml-0 md:ml-40 p-4 border-b">
      <h3 className="text-xl font-bold ml-8">
        Welcome{name ? `, ${name}` : ""}
      </h3>

      <div className="flex items-center gap-3">
        <Image
                      src="/images/logos/logo_5.jpg"
                      alt="The North Himalayas logo"
                      width={60}
                      height={40}
                      className="rounded-sm"
                    />
      </div>
    </div>
  );
}
