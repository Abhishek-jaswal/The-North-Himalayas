'use client';
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function Topbar() {

        const router = useRouter();
    const handleLogout = () => {
    pb.authStore.clear();
    router.push("/pro/login");
  };
  return (
    <div className="w-full bg-white shadow flex items-center justify-between px-6 py-4">
      <h2 className="text-xl font-semibold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        {/* Notifications icon */}
        <div className="cursor-pointer">
          🔔
        </div>

        {/* Admin Profile */}
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div>
       <button 
        onClick={handleLogout} 
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
