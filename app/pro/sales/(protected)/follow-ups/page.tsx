"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { PhoneCall, Clock, AlertCircle, Calendar, ChevronRight } from "lucide-react";

interface Lead { id: string; name: string; phone: string; next_followup: string; }
type Tab = "today" | "overdue" | "upcoming";

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const isToday = (dateStr?: string) => { if (!dateStr) return false; return isSameDay(new Date(dateStr), new Date()); };
const isOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
};
const isUpcoming = (dateStr?: string) => {
  if (!dateStr) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(dateStr) > today;
};

const tabConfig = {
  today:    { label: "Today",    icon: PhoneCall,    badge: "bg-indigo-100 text-indigo-700",  active: "bg-indigo-600 text-white shadow-indigo-200" },
  overdue:  { label: "Overdue",  icon: AlertCircle,  badge: "bg-red-100 text-red-700",        active: "bg-red-500 text-white shadow-red-200" },
  upcoming: { label: "Upcoming", icon: Calendar,     badge: "bg-emerald-100 text-emerald-700",active: "bg-emerald-600 text-white shadow-emerald-200" },
};

export default function FollowUpsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("today");
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return;
      const res = await pb.collection("leads").getList(1, 200, {
        filter: `assigned_to="${userId}" && next_followup!=null && status!="Converted" && status!="Lost"`,
        sort: "next_followup",
      });
      setAllLeads(res.items.map((item) => ({ id: item.id, name: item.name, phone: item.phone, next_followup: item.next_followup })));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = allLeads.filter((l) => {
    if (tab === "today") return isToday(l.next_followup);
    if (tab === "overdue") return isOverdue(l.next_followup);
    return isUpcoming(l.next_followup);
  });

  const count = (t: Tab) => allLeads.filter((l) => {
    if (t === "today") return isToday(l.next_followup);
    if (t === "overdue") return isOverdue(l.next_followup);
    return isUpcoming(l.next_followup);
  }).length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-slate-800">Follow-ups</h1>
        <p className="text-xs text-slate-400 mt-0.5">{allLeads.length} total scheduled</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.entries(tabConfig) as [Tab, typeof tabConfig.today][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                active ? `${cfg.active} shadow-md` : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}
            >
              <Icon size={13} />
              {cfg.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-white/20 text-white" : cfg.badge}`}>
                {count(key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Clock size={32} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No {tab} follow-ups</p>
          </div>
        ) : (
          filtered.map((lead) => (
            <div
              key={lead.id}
              onClick={() => router.push(`/pro/sales/leads/${lead.id}`)}
              className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                {lead.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{lead.name}</p>
                <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs font-semibold ${tab === "overdue" ? "text-red-600" : "text-indigo-600"}`}>
                  {new Date(lead.next_followup).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                {tab === "upcoming" && (
                  <p className="text-[10px] text-slate-400">
                    {new Date(lead.next_followup).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
              <ChevronRight size={15} className="text-slate-300 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
