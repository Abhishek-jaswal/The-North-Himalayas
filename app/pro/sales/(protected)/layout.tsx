"use client";

import SalesSidebar from "../components/SalesSidebar";
import SalesTopbar from "../components/SalesTopbar";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SalesSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <SalesTopbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}
