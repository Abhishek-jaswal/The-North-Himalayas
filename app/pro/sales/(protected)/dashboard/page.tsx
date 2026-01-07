"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Users, CheckCircle, PhoneCall, Flame } from "lucide-react";

import StatCard from "../../components/StatCard";

interface Salesperson {
  id: string;
  [key: string]: any;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  created: string;
  assigned_to: string;
  next_followup?: string;
}

export default function SalesDashboard() {
  const router = useRouter();

  const [salesperson, setSalesperson] = useState<Salesperson | null>(null);
  const [stats, setStats] = useState({
    assigned: 0,
    converted: 0,
    todayAssigned: 0,
    todayFollowups: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔑 LOCAL DATE HELPER (IST SAFE)
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const fetchStats = async (salespersonId: string) => {
    try {
      const res = await pb.collection("leads").getList(1, 100, {
        filter: `assigned_to = "${salespersonId}"`,
        sort: "-created",
      });
     
      const leads = res.items as unknown as Lead[];
      const today = getLocalDate();

      const assigned = res.totalItems;

      const converted = leads.filter(
        l => l.status?.toLowerCase() === "converted"
      ).length;

      const todayAssigned = leads.filter(
        l => l.created?.split("T")[0] === today
      ).length;

      const todayFollowups = leads.filter(
        l =>
          l.next_followup &&
          l.next_followup.split("T")[0] === today &&
          !["converted", "lost"].includes(l.status?.toLowerCase())
      ).length;

      setStats({
        assigned,
        converted,
        todayAssigned,
        todayFollowups,
      });

      setRecentLeads(leads.slice(0, 5));
    } catch (err) {
      console.error("Failed to load leads:", err);
    }
  };

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/pro/sales/login");
      return;
    }

    const sp = pb.authStore.model;

    if (!sp?.id) {
      pb.authStore.clear();
      router.push("/pro/sales/login");
      return;
    }

    setSalesperson(sp);
    fetchStats(sp.id);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 ml-0 md:ml-64 p-4">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="Assigned Leads"
            value={stats.assigned}
            icon={<Users />}
          />
          <StatCard
            title="Converted"
            value={stats.converted}
            icon={<CheckCircle />}
          />
          <StatCard
            title="Today's Leads"
            value={stats.todayAssigned}
            icon={<Flame />}
          />
          <StatCard
            title="Today's Follow-ups"
            value={stats.todayFollowups}
            icon={<PhoneCall />}
          />
        </div>

        {/* RECENT LEADS */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="text-lg font-bold mb-3">Recent Leads</h3>

          {recentLeads.length === 0 ? (
            <p className="text-gray-500">No leads assigned yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/pro/sales/leads/${lead.id}`)
                    }
                  >
                    <td className="p-2">{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td className="capitalize">{lead.source}</td>
                    <td className="capitalize">{lead.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
