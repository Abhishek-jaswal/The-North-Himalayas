'use client';

import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SalesDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const logged = pb.authStore.model;

    // Not logged in → Redirect
    if (!logged) {
      router.push("/pro/sales/login");
      return;
    }

    // If inactive → block & logout
    if (!logged.is_active) {
      pb.authStore.clear();
      router.push("/pro/sales/login");
      return;
    }

    setUser(logged);
  }, []);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome, {user.name} 👋
      </h1>

      <p className="mt-3 text-gray-600">
        You are logged in as a salesperson.
      </p>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Total Assigned Leads:</strong> {user.total_assigned}</p>
        <p><strong>Total Converted:</strong> {user.total_converted}</p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => {
          pb.authStore.clear();
          router.push("/pro/sales/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
