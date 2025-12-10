"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

import SalesSidebar from "./components/SalesSidebar";
import SalesTopbar from "./components/SalesTopbar";

export default function SalesDashboard() {
  const router = useRouter();
  const [salesperson, setSalesperson] = useState<any>(null);
  const [stats, setStats] = useState({
    assigned: 0,
    converted: 0,
    todayAssigned: 0,
    todayFollowups: 0,
  });

  useEffect(() => {
    // Check login
    if (!pb.authStore.isValid) {
      router.push("/pro/sales/login");
      return;
    }

    const sp = pb.authStore.model;
    setSalesperson(sp);

    fetchStats(sp.id);
  }, []);

  const fetchStats = async (id: string) => {
    try {
      // Total assigned
      const assigned = await pb.collection("leads").getFullList({
        filter: `salesperson="${id}"`
      });

      // Converted
      const converted = assigned.filter((x) => x.status === "converted");

      // Today assigned
      const today = new Date().toISOString().split("T")[0];
      const todayAssigned = assigned.filter(x => x.created.split("T")[0] === today);

      // Today followups
      const todayFollowups = assigned.filter(x => x.next_followup === today);

      setStats({
        assigned: assigned.length,
        converted: converted.length,
        todayAssigned: todayAssigned.length,
        todayFollowups: todayFollowups.length
      });

    } catch (err) {
      console.error(err);
    }
  };

  if (!salesperson) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <SalesSidebar />

      {/* Content Area */}
      <div className="flex-1 ml-0 md:ml-64 p-4">
        
        {/* Topbar */}
        <SalesTopbar name={salesperson.name} />

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card title="Assigned Leads" value={stats.assigned} />
          <Card title="Converted Leads" value={stats.converted} />
          <Card title="Today's New Leads" value={stats.todayAssigned} />
          <Card title="Today's Follow-ups" value={stats.todayFollowups} />
        </div>

        {/* Lead Table (placeholder) */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="text-lg font-bold mb-3">Recent Leads</h3>
          <p className="text-gray-500">Lead table will go here…</p>
        </div>

      </div>
    </div>
  );
}

// Reusable Card
function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}
