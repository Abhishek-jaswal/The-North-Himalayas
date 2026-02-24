"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";
import { Search, RefreshCw, Filter } from "lucide-react";
import LeadRow from "./components/LeadRow";
import LeadModal from "./components/LeadModal";

export default function LeadsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const user = pb.authStore.model;

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr); const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  useEffect(() => {
    if (!user?.id) { router.replace("/sales/login"); }
  }, [router, user]);

  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await pb.collection("leads").getList(1, 100, {
      sort: "-created",
      filter: `assigned_to="${user.id}"`,
    });
    setLeads(res.items as unknown as Lead[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { (async () => { await fetchLeads(); })(); }, [fetchLeads]);

  const dashboardFiltered = useMemo(() => {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    switch (type) {
      case "monthly":   return leads.filter((l) => new Date(l.created) >= monthStart);
      case "today":     return leads.filter((l) => isToday(l.created));
      case "followups": return leads.filter((l) => isToday(l.next_followup) && l.status && !["Converted", "Lost"].includes(l.status));
      case "converted": return leads.filter((l) => l.status === "Converted");
      case "booked":    return leads.filter((l) => l.status === "Booked" && new Date(l.created) >= monthStart);
      case "pending":   return leads.filter((l) => l.status === "New");
      case "lost":      return leads.filter((l) => l.status === "Lost");
      default:          return leads;
    }
  }, [leads, type]);

  const filteredLeads = useMemo(() => {
    return dashboardFiltered.filter((lead) => {
      const matchesQuery = !query || lead.name?.toLowerCase().includes(query.toLowerCase()) || lead.phone?.includes(query);
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [dashboardFiltered, query, statusFilter]);

  const typeLabel: Record<string, string> = {
    total: "All", monthly: "Monthly", today: "Today", followups: "Follow-ups",
    converted: "Converted", booked: "Booked", pending: "Pending", lost: "Lost",
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {type ? typeLabel[type] : "All"} Leads
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{filteredLeads.length} records</p>
        </div>
        <button
          disabled={loading}
          onClick={fetchLeads}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
            loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
          }`}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            placeholder="Search name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:border-indigo-400 transition appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="In Progress">In Progress</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Search size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No leads found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        )}
        {!loading && filteredLeads.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            onView={() => setSelectedLead(lead)}
            onRefresh={fetchLeads}
          />
        ))}
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => { setSelectedLead(null); fetchLeads(); }}
        />
      )}
    </div>
  );
}
