"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    newToday: 0,
    followups: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const result = await pb.collection("leads").getList(1, 200, {
          sort: "-created",
        });

        const leads = result.items;
        const today = new Date().toISOString().split("T")[0];

        setStats({
          total: leads.length,
          assigned: leads.filter(l => l.assigned_to).length,
          newToday: leads.filter(l => l.created.startsWith(today)).length,
          followups: leads.filter(l => l.status === "followup").length,
        });
      } catch (err) {
        console.error("PocketBase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat title="Total Leads" value={stats.total} />
        <Stat title="Assigned Leads" value={stats.assigned} />
        <Stat title="New Today" value={stats.newToday} />
        <Stat title="Follow-ups Today" value={stats.followups} />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
