'use client';

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function SalesDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalLeads: 0,
    todaysTasks: 0,
    pendingFollowups: 0,
    newLeadsToday: 0,
    converted: 0
  });

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("pro/sales/login");
      return;
    }

    const user = pb.authStore.model;
    if (!user || user.role !== "salesperson") {
      router.push("/login");
      return;
    }

    loadDashboardData(user.id);
  }, []);

  const loadDashboardData = async (salespersonId: string) => {
    try {
      // TOTAL LEADS
      const allLeads = await pb.collection("leads").getFullList({
        filter: `salesperson_id = "${salespersonId}"`
      });

      // TODAY DATE
      const today = new Date().toISOString().split("T")[0];

      // TODAY TASKS
      const todayTasks = allLeads.filter(l => l.next_followup_date === today);

      // PENDING FOLLOWUPS
      const pending = allLeads.filter(
        l => l.next_followup_date < today && l.status !== "converted"
      );

      // NEW LEADS TODAY
      const newLeadsToday = allLeads.filter(
        l => l.created.split(" ")[0] === today
      );

      // CONVERTED
      const converted = allLeads.filter(l => l.status === "converted");

      setStats({
        totalLeads: allLeads.length,
        todaysTasks: todayTasks.length,
        pendingFollowups: pending.length,
        newLeadsToday: newLeadsToday.length,
        converted: converted.length,
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="text-center p-10">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Salesperson Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <Card title="Total Leads" value={stats.totalLeads} />
        <Card title="Today's Tasks" value={stats.todaysTasks} />
        <Card title="Pending Follow-ups" value={stats.pendingFollowups} />
        <Card title="New Leads Today" value={stats.newLeadsToday} />
        <Card title="Converted Leads" value={stats.converted} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
