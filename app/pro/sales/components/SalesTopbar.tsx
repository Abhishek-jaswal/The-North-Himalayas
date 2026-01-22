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
    <div className="bg-white rounded  flex items-center justify-between ml-0 md:ml-64 p-2 bg-gray-50 border-b border-gray-200 mt-12 md:mt-0">
      <h3 className="text-xl font-bold ml-8">
        Welcome{name ? `, ${name}` : ""}
      
       <p className="text-sm text-gray-500 ">
        Here’s what’s happening with your sales today.
      </p></h3>
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
