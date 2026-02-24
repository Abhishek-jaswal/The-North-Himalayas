import { pb } from "@/app/lib/pocketbase";
import StatCard from "./components/admin/StatCard";
import { Target, UserCheck, Sparkles, Bell } from "lucide-react";

export default async function AdminDashboardClient() {
  const leads = await pb.collection("leads").getFullList();

  const today = new Date().toDateString();

  const stats = {
    total: leads.length,
    assigned: leads.filter(l => l.assigned_to).length,
    newToday: leads.filter(
      l => new Date(l.created).toDateString() === today
    ).length,
    followups: leads.filter(l => l.next_followup).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your CRM activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Target}
          accent="bg-violet-500"
          sub="All time"
        />
        <StatCard
          title="Assigned"
          value={stats.assigned}
          icon={UserCheck}
          accent="bg-blue-500"
          sub="Active leads"
        />
        <StatCard
          title="New Today"
          value={stats.newToday}
          icon={Sparkles}
          accent="bg-emerald-500"
          sub="Last 24 hours"
        />
        <StatCard
          title="Follow-ups"
          value={stats.followups}
          icon={Bell}
          accent="bg-amber-500"
          sub="Scheduled"
        />
      </div>
    </div>
  );
}
