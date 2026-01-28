"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import type { RecordModel } from "pocketbase";
import type { Lead } from "@/app/pro/types/lead";
import {
  Users,
  CheckCircle,
  PhoneCall,
  Flame,
  XCircle,
  CalendarCheck,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function SalesDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [salesperson, setSalesperson] = useState<RecordModel | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    today: 0,
    followups: 0,
    converted: 0,
    booked: 0,
    pending: 0,
    lost: 0,
    monthlyPercent: 0,
  });
const isToday = (dateStr?: string) => {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const now = new Date();

  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

  /* ================= DATE HELPERS ================= */
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const go = (type: string) => {
    router.push(`/pro/sales/leads?type=${type}`);
  };

  /* ================= FETCH DATA ================= */
const loadDashboard = async (userId: string) => {
  const res = await pb.collection("leads").getFullList({
    filter: `assigned_to="${userId}"`,
    sort: "-created",
  });

  const leads = res as unknown as Lead[];

  const total = leads.length;

  const monthly = leads.filter(
    (l) => new Date(l.created) >= monthStart
  ).length;

  const lastMonth = leads.filter(
    (l) =>
      new Date(l.created) >= lastMonthStart &&
      new Date(l.created) <= lastMonthEnd
  ).length;

  const monthlyPercent =
    lastMonth === 0 ? 100 : ((monthly - lastMonth) / lastMonth) * 100;

  // ✅ FIXED
  const todayLeads = leads.filter((l) => isToday(l.created)).length;

  // ✅ FIXED
  const followups = leads.filter(
    (l) =>
      l.next_followup && isToday(l.next_followup) &&
      !["Converted", "Lost"].includes(l.status)
  ).length;

  const converted = leads.filter((l) => l.status === "Converted").length;
  const booked = leads.filter((l) => l.status === "Booked").length;
  const lost = leads.filter((l) => l.status === "Lost").length;
  const pending = total - converted - lost - booked;

  setStats({
    total,
    monthly,
    today: todayLeads,
    followups,
    converted,
    booked,
    pending,
    lost,
    monthlyPercent: Math.round(monthlyPercent),
  });
};


  /* ================= INIT ================= */
  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/pro/sales/login");
      return;
    }

    const user = pb.authStore.model;
    if (!user?.id) {
      router.push("/pro/sales/login");
      return;
    }

    const fetchDashboard = async () => {
      await loadDashboard(user.id);
      setSalesperson(user);
      setLoading(false);
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div onClick={() => go("total")} className="cursor-pointer">
          <StatCard title="Total Leads" value={stats.total} percent={stats.monthlyPercent}
            icon={<Users size={18} />} color="bg-indigo-50" />
        </div>

        <div onClick={() => go("monthly")} className="cursor-pointer">
          <StatCard title="Monthly Leads" value={stats.monthly}
            icon={<CalendarCheck size={18} />} color="bg-purple-50" />
        </div>

        <div onClick={() => go("today")} className="cursor-pointer">
          <StatCard title="Today's Leads" value={stats.today}
            icon={<Flame size={18} />} color="bg-yellow-50" />
        </div>

        <div onClick={() => go("followups")} className="cursor-pointer">
          <StatCard title="Today's Follow-ups" value={stats.followups}
            icon={<PhoneCall size={18} />} color="bg-teal-50" />
        </div>

        <div onClick={() => go("converted")} className="cursor-pointer">
          <StatCard title="Total Converted" value={stats.converted}
            icon={<CheckCircle size={18} />} color="bg-green-50" />
        </div>

        <div onClick={() => go("booked")} className="cursor-pointer">
          <StatCard title="Booked" value={stats.booked}
            icon={<CalendarCheck size={18} />} color="bg-blue-50" />
        </div>

        <div onClick={() => go("pending")} className="cursor-pointer">
          <StatCard title="Pending Leads" value={stats.pending}
            icon={<Users size={18} />} color="bg-orange-50" />
        </div>

        <div onClick={() => go("lost")} className="cursor-pointer">
          <StatCard title="Lost" value={stats.lost}
            icon={<XCircle size={18} />} color="bg-red-50" />
        </div>
      </div>
    </div>
  );
}
