"use client";

import { useEffect, useState, useCallback } from "react";
import { pb } from "@/app/lib/pocketbase";
import {
  Target, UserCheck, Sparkles, Bell, TrendingUp,
  Users, ChevronRight, UserPlus, CheckCircle2,
  Clock, AlertCircle, X, Check, RefreshCw,
} from "lucide-react";

/* ─── Types ─────────────────────────────────── */
interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  message?: string;
  assigned_to?: string;
  created: string;
}
interface Salesperson {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  total_assigned: number;
}

/* ─── Stat Card ──────────────────────────────── */
function StatCard({
  title, value, sub, icon: Icon, gradient, change,
}: {
  title: string; value: number; sub: string;
  icon: React.ElementType; gradient: string; change?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
        {change && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-800 leading-none mb-1">{value}</p>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-[10px] text-slate-300 mt-0.5">{sub}</p>
    </div>
  );
}

/* ─── Status Badge ───────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new:        "bg-blue-50 text-blue-600 border-blue-200",
    assigned:   "bg-amber-50 text-amber-600 border-amber-200",
    converted:  "bg-emerald-50 text-emerald-600 border-emerald-200",
    lost:       "bg-red-50 text-red-500 border-red-200",
    contacted:  "bg-purple-50 text-purple-600 border-purple-200",
    interested: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };
  const cls = map[status?.toLowerCase()] ?? "bg-slate-50 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${cls}`}>
      {status || "new"}
    </span>
  );
}

/* ─── Main Component ─────────────────────────── */
export default function AdminDashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"unassigned" | "all">("unassigned");
  const [toast, setToast] = useState<string | null>(null);

  /* ─── Fetch ──────────────────────────────── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, salesRes] = await Promise.all([
        pb.collection("leads").getFullList({ sort: "-created" }),
        pb.collection("salespersons").getFullList({ sort: "name" }),
      ]);

      const salesWithCounts = salesRes.map((sp) => ({
        id: sp.id,
        name: sp.name,
        email: sp.email,
        is_active: sp.is_active,
        total_assigned: leadsRes.filter((l) => l.assigned_to === sp.id).length,
      }));

      setLeads(leadsRes as unknown as Lead[]);
      setSalespersons(salesWithCounts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Realtime
    pb.collection("leads").subscribe("*", loadData);
    return () => { pb.collection("leads").unsubscribe("*"); };
  }, [loadData]);

  /* ─── Assign lead ────────────────────────── */
  const assignLead = async (leadId: string, salespersonId: string) => {
    if (!salespersonId) return;
    setAssigning(leadId);
    try {
      await pb.collection("leads").update(leadId, {
        assigned_to: salespersonId,
        status: "assigned",
      });
      const sp = salespersons.find((s) => s.id === salespersonId);
      setSuccessId(leadId);
      setToast(`Lead assigned to ${sp?.name ?? "salesperson"}`);
      setTimeout(() => setSuccessId(null), 2000);
      setTimeout(() => setToast(null), 3000);
      await loadData();
    } finally {
      setAssigning(null);
    }
  };

  /* ─── Unassign lead ──────────────────────── */
  const unassignLead = async (leadId: string) => {
    setAssigning(leadId);
    try {
      await pb.collection("leads").update(leadId, { assigned_to: null, status: "new" });
      setToast("Lead unassigned");
      setTimeout(() => setToast(null), 2500);
      await loadData();
    } finally {
      setAssigning(null);
    }
  };

  /* ─── Stats ──────────────────────────────── */
  const today = new Date().toDateString();
  const stats = {
    total:      leads.length,
    assigned:   leads.filter((l) => l.assigned_to).length,
    unassigned: leads.filter((l) => !l.assigned_to).length,
    newToday:   leads.filter((l) => new Date(l.created).toDateString() === today).length,
    followups:  leads.filter((l) => l.next_followup).length,
  };

  /* ─── Filtered leads ─────────────────────── */
  const displayedLeads = filter === "unassigned"
    ? leads.filter((l) => !l.assigned_to)
    : leads;

  const activeSalespeople = salespersons.filter((s) => s.is_active);

  return (
    <div className="space-y-6 relative">

      {/* ─── Toast ──────────────────────────── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-top-2">
          <CheckCircle2 size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* ─── Header ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage leads and your team</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ─── Stat Cards ─────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads"   value={stats.total}      sub="All time records"       icon={Target}     gradient="bg-gradient-to-br from-slate-600 to-slate-800" />
        <StatCard title="Assigned"      value={stats.assigned}   sub="Active assignments"     icon={UserCheck}  gradient="bg-gradient-to-br from-amber-400 to-orange-500" change={`${stats.unassigned} left`} />
        <StatCard title="New Today"     value={stats.newToday}   sub="Last 24 hours"          icon={Sparkles}   gradient="bg-gradient-to-br from-emerald-400 to-teal-500" />
        <StatCard title="Follow-ups"    value={stats.followups}  sub="Scheduled callbacks"    icon={Bell}       gradient="bg-gradient-to-br from-violet-500 to-indigo-600" />
      </div>

      {/* ─── Two Column: Assign Panel + Team ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Lead Assignment Panel (2/3 width) ─ */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <UserPlus size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Lead Assignment</h2>
                <p className="text-[10px] text-slate-400">Assign leads to your sales team</p>
              </div>
            </div>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {(["unassigned", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    filter === f
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f}
                  {f === "unassigned" && (
                    <span className="ml-1.5 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {stats.unassigned}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Lead rows */}
          <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : displayedLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <CheckCircle2 size={36} className="mb-3 text-emerald-300" />
                <p className="font-semibold text-sm text-slate-500">All leads assigned!</p>
                <p className="text-xs mt-1">Switch to &quot;All&quot; to view everything</p>
              </div>
            ) : (
              displayedLeads.map((lead) => {
                const isSuccess = successId === lead.id;
                const isProcessing = assigning === lead.id;
                const assignedSP = salespersons.find((s) => s.id === lead.assigned_to);

                return (
                  <div
                    key={lead.id}
                    className={`px-5 py-3.5 transition-colors ${
                      isSuccess ? "bg-emerald-50" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-600 text-sm shrink-0 border border-slate-200">
                        {(lead.name || "?").charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-800 truncate">{lead.name || "Unknown"}</p>
                          <StatusBadge status={lead.status} />
                          {isSuccess && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                              <Check size={11} /> Assigned
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
                          {lead.source && (
                            <span className="text-[10px] text-slate-400 capitalize">· {lead.source}</span>
                          )}
                          <span className="text-[10px] text-slate-300">
                            {new Date(lead.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        {assignedSP && (
                          <p className="text-[10px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
                            <UserCheck size={10} /> {assignedSP.name}
                          </p>
                        )}
                      </div>

                      {/* Assignment control */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isProcessing ? (
                          <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <select
                              defaultValue={lead.assigned_to || ""}
                              onChange={(e) => {
                                if (e.target.value) assignLead(lead.id, e.target.value);
                              }}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition cursor-pointer max-w-[140px]"
                            >
                              <option value="">Assign to…</option>
                              {activeSalespeople.map((sp) => (
                                <option key={sp.id} value={sp.id}>
                                  {sp.name} ({sp.total_assigned})
                                </option>
                              ))}
                            </select>
                            {lead.assigned_to && (
                              <button
                                onClick={() => unassignLead(lead.id)}
                                title="Unassign"
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors border border-red-100"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Panel footer */}
          {displayedLeads.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <p className="text-xs text-slate-400">Showing {displayedLeads.length} leads</p>
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle size={11} />
                {stats.unassigned} unassigned
              </p>
            </div>
          )}
        </div>

        {/* ── Team Performance Panel (1/3 width) ─ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Team Performance</h2>
              <p className="text-[10px] text-slate-400">{activeSalespeople.length} active members</p>
            </div>
          </div>

          <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
            {salespersons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Users size={28} className="mb-2 opacity-40" />
                <p className="text-xs">No salespersons yet</p>
              </div>
            ) : (
              salespersons.map((sp, i) => {
                const pct = stats.assigned > 0
                  ? Math.round((sp.total_assigned / stats.assigned) * 100)
                  : 0;
                return (
                  <div key={sp.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Rank */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                        i === 0 ? "bg-amber-100 text-amber-600" :
                        i === 1 ? "bg-slate-100 text-slate-500" :
                        "bg-slate-50 text-slate-400"
                      }`}>
                        {i + 1}
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 border border-indigo-100">
                        {sp.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name + status */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{sp.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${sp.is_active ? "bg-emerald-400" : "bg-slate-300"}`} />
                          <p className="text-[10px] text-slate-400">{sp.is_active ? "Active" : "Inactive"}</p>
                        </div>
                      </div>

                      {/* Count */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-700">{sp.total_assigned}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide">leads</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-8">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">{stats.assigned} leads assigned total</span>
              <span className="text-violet-600 font-semibold flex items-center gap-1">
                <ChevronRight size={11} />
                View all
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats Row ─────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Unassigned",  value: stats.unassigned,                                         icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50"  },
          { label: "Assigned",    value: stats.assigned,                                            icon: UserCheck,     color: "text-emerald-600",bg: "bg-emerald-50"},
          { label: "Active Team", value: activeSalespeople.length,                                  icon: Users,         color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Assign Rate", value: stats.total > 0 ? Math.round((stats.assigned / stats.total) * 100) : 0, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", suffix: "%" },
        ].map(({ label, value, icon: Icon, color, bg, suffix }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={15} className={color} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 leading-none">{value}{suffix}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
