"use client";
import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { PhoneCall, AlertCircle, Calendar, ChevronRight, Clock } from "lucide-react";

interface Lead { id: string; name: string; phone: string; next_followup: string; }
type Tab = "today" | "overdue" | "upcoming";

const isSameDay = (a: Date, b: Date) => a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();
const isToday = (d?: string) => { if (!d) return false; return isSameDay(new Date(d), new Date()); };
const isOverdue = (d?: string) => { if (!d) return false; const t=new Date(); t.setHours(0,0,0,0); return new Date(d)<t; };
const isUpcoming = (d?: string) => { if (!d) return false; const t=new Date(); t.setHours(0,0,0,0); return new Date(d)>t; };

const tabs = {
  today:    { label: "Today",    icon: PhoneCall,   activeGrad: "from-indigo-500 to-violet-500", dot: "bg-indigo-400" },
  overdue:  { label: "Overdue",  icon: AlertCircle, activeGrad: "from-red-500 to-rose-500",      dot: "bg-red-400"    },
  upcoming: { label: "Upcoming", icon: Calendar,    activeGrad: "from-emerald-500 to-teal-500",  dot: "bg-emerald-400"},
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
      setAllLeads(res.items.map((i) => ({ id: i.id, name: i.name, phone: i.phone, next_followup: i.next_followup })));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = allLeads.filter((l) => tab==="today"?isToday(l.next_followup):tab==="overdue"?isOverdue(l.next_followup):isUpcoming(l.next_followup));
  const count = (t: Tab) => allLeads.filter((l) => t==="today"?isToday(l.next_followup):t==="overdue"?isOverdue(l.next_followup):isUpcoming(l.next_followup)).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-lg font-black text-slate-800">Follow-ups</h1>
        <p className="text-xs text-slate-400 mt-0.5">{allLeads.length} total scheduled</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.entries(tabs) as [Tab, typeof tabs.today][]).map(([key, cfg]) => {
          const active = tab === key;
          const Icon = cfg.icon;
          return (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? `bg-gradient-to-r ${cfg.activeGrad} text-white shadow-md`
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}
            >
              <Icon size={12} />
              {cfg.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
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
            <Clock size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-semibold">No {tab} follow-ups</p>
          </div>
        ) : filtered.map((lead) => (
          <div key={lead.id} onClick={() => router.push(`/pro/sales/leads/${lead.id}`)}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-100">
              {lead.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
              <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xs font-bold ${tab==="overdue"?"text-red-600":"text-indigo-600"}`}>
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
        ))}
      </div>
    </div>
  );
}
