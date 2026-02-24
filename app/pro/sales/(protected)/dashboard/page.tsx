"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import type { RecordModel } from "pocketbase";
import type { Lead } from "@/app/pro/types/lead";
import { Users, CheckCircle, PhoneCall, Flame, XCircle, CalendarCheck } from "lucide-react";
import StatCard from "../../components/StatCard";

export default function SalesDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [salesperson, setSalesperson] = useState<RecordModel | null>(null);

  const [stats, setStats] = useState({
    total: 0, monthly: 0, today: 0, followups: 0,
    converted: 0, booked: 0, pending: 0, lost: 0, monthlyPercent: 0,
  });

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const go = (type: string) => { router.push(`/pro/sales/leads?type=${type}`); };

  const loadDashboard = async (userId: string) => {
    const res = await pb.collection("leads").getFullList({
      filter: `assigned_to="${userId}"`,
      sort: "-created",
    });

    const leads = res as unknown as Lead[];
    const total = leads.length;
    const monthly = leads.filter((l) => new Date(l.created) >= monthStart).length;
    const lastMonth = leads.filter((l) => new Date(l.created) >= lastMonthStart && new Date(l.created) <= lastMonthEnd).length;
    const monthlyPercent = lastMonth === 0 ? 100 : ((monthly - lastMonth) / lastMonth) * 100;
    const todayLeads = leads.filter((l) => isToday(l.created)).length;
    const followups = leads.filter((l) => l.next_followup && isToday(l.next_followup) && !["Converted", "Lost"].includes(l.status)).length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const booked = leads.filter((l) => l.status === "Booked").length;
    const lost = leads.filter((l) => l.status === "Lost").length;
    const pending = total - converted - lost - booked;

    setStats({ total, monthly, today: todayLeads, followups, converted, booked, pending, lost, monthlyPercent: Math.round(monthlyPercent) });
  };

  useEffect(() => {
    if (!pb.authStore.isValid) { router.push("/pro/sales/login"); return; }
    const user = pb.authStore.model;
    if (!user?.id) { router.push("/pro/sales/login"); return; }
    const fetchDashboard = async () => {
      await loadDashboard(user.id);
      setSalesperson(user);
      setLoading(false);
    };
    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const cards = [
    { type: "total",     title: "Total Leads",       value: stats.total,     percent: stats.monthlyPercent, icon: <Users size={17} className="text-indigo-600" />,   color: "bg-indigo-50" },
    { type: "monthly",   title: "This Month",        value: stats.monthly,   icon: <CalendarCheck size={17} className="text-purple-600" />, color: "bg-purple-50" },
    { type: "today",     title: "Today's Leads",     value: stats.today,     icon: <Flame size={17} className="text-amber-600" />,         color: "bg-amber-50" },
    { type: "followups", title: "Today's Follow-ups",value: stats.followups, icon: <PhoneCall size={17} className="text-teal-600" />,      color: "bg-teal-50" },
    { type: "converted", title: "Converted",         value: stats.converted, icon: <CheckCircle size={17} className="text-emerald-600" />, color: "bg-emerald-50" },
    { type: "booked",    title: "Booked",            value: stats.booked,    icon: <CalendarCheck size={17} className="text-blue-600" />,  color: "bg-blue-50" },
    { type: "pending",   title: "Pending",           value: stats.pending,   icon: <Users size={17} className="text-orange-600" />,        color: "bg-orange-50" },
    { type: "lost",      title: "Lost",              value: stats.lost,      icon: <XCircle size={17} className="text-red-600" />,         color: "bg-red-50" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Tap any card to see filtered leads</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.type} onClick={() => go(c.type)}>
            <StatCard title={c.title} value={c.value} percent={c.percent} icon={c.icon} color={c.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
