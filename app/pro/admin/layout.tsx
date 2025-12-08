'use client';


import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
