"use client";

import SalesSidebar from "../components/SalesSidebar";
import SalesTopbar from "../components/SalesTopbar";
import NotificationInit from "./NotificationInit";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <NotificationInit />
      <SalesSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="hidden md:block">
          <SalesTopbar />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
