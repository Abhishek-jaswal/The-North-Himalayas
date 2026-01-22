
import { pb } from "@/app/lib/pocketbase";
import StatCard from "./components/admin/StatCard";

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} />
        <StatCard title="Assigned Leads" value={stats.assigned} />
        <StatCard title="New Today" value={stats.newToday} />
        <StatCard title="Follow-ups" value={stats.followups} />
      </div>

      
    </div>
  );
}
