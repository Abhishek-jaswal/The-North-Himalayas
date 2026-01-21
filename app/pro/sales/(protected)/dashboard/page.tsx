"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import type { RecordModel } from "pocketbase";
import { Users, CheckCircle, PhoneCall, Flame, Delete } from "lucide-react";

import StatCard from "../../components/StatCard";

/* =======================
   TYPES
======================= */
interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  message: string;
  status: string;
  created: string;
  assigned_to: string;
  next_followup?: string;
}

/* =======================
   PAGE
======================= */
export default function SalesDashboard() {
  const router = useRouter();

  // ✅ FIX: RecordModel is correct PocketBase auth type
  const [salesperson, setSalesperson] = useState<RecordModel | null>(null);

  const [stats, setStats] = useState({
    assigned: 0,
    converted: 0,
    todayAssigned: 0,
    todayFollowups: 0,
  });

  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     DATE HELPER (IST SAFE)
  ======================= */
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  /* =======================
     FETCH STATS
  ======================= */
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
        (l) => l.status?.toLowerCase() === "converted"
      ).length;

      const todayAssigned = leads.filter(
        (l) => l.created?.split("T")[0] === today
      ).length;

      const todayFollowups = leads.filter(
        (l) =>
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

  /* =======================
     AUTH + INIT
  ======================= */
useEffect(() => {
  const init = async () => {
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
    await fetchStats(sp.id);
    setLoading(false);
  };

  init();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [router]);


  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 ml-0 md:ml-40 p-4">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-pink-200  rounded-xl  shadow hover:shadow-lg transition">

          <StatCard title="Total Leads" value={stats.assigned} icon={<Users />} /></div>
           <div className="bg-gray-400  rounded-xl  shadow hover:shadow-lg transition">
          <StatCard  title="Monthly Leads" value={stats.converted} icon={<CheckCircle />} /></div>
                     <div className="bg-yellow-200  rounded-xl  shadow hover:shadow-lg transition">

          <StatCard title="Today's Leads" value={stats.todayAssigned} icon={<Flame />} /></div>
                     <div className="bg-blue-200  rounded-xl  shadow hover:shadow-lg transition">

          <StatCard title="Today's Follow-ups" value={stats.todayFollowups} icon={<PhoneCall />} /></div>
                     <div className="bg-purple-600  rounded-xl  shadow hover:shadow-lg transition">

            <StatCard title="Total Converted" value={stats.todayAssigned} icon={<Flame />} /></div>
                       <div className="bg-green-200  rounded-xl  shadow hover:shadow-lg transition">

          <StatCard title="Booked" value={stats.todayFollowups} icon={<PhoneCall />} /></div>
                     <div className="bg-gray-200  rounded-xl  shadow hover:shadow-lg transition">

           <StatCard title="Pending Leads" value={stats.todayAssigned} icon={<Flame />} /></div>
                      <div className="bg-red-300  rounded-xl  shadow hover:shadow-lg transition">

          <StatCard title="Lost" value={stats.todayFollowups} icon={<Delete />} /></div>

        </div>

       
      

      </div>
    </div>
  );
}
