"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";

import LeadRow from "./components/LeadRow";
import LeadModal from "./components/LeadModal";


/* =======================
   PAGE
======================= */
export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const user = pb.authStore.model;

  /* =======================
     AUTH GUARD
  ======================= */
  useEffect(() => {
    if (!user?.id) {
      router.replace("/sales/login");
    }
  }, [router, user]);

  /* =======================
     FETCH LEADS
  ======================= */
  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await pb.collection("leads").getList(1, 100, {
        sort: "-created",
        filter: `assigned_to="${user.id}"`,
      });

      setLeads(res.items as unknown as Lead[]);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /* =======================
     FILTERING (FAST)
  ======================= */
  const filteredLeads = useMemo(() => {
    if (!user?.id) return [];

    return leads.filter((lead) => {
      if (lead.assigned_to !== user.id) return false;

      const matchesQuery =
        !query ||
        lead.name?.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone?.includes(query);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [leads, query, statusFilter, user?.id]);

  /* =======================
     RENDER
  ======================= */
 return (
  <div className="flex-1 ml-0 md:ml-64 p-3 md:p-6 space-y-5">
    {/* ================= HEADER ================= */}
 {/* ================= HEADER ================= */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-xl md:text-2xl font-semibold">My Leads</h2>

    <p className="text-sm text-gray-500">
      Showing {filteredLeads.length} lead
      {filteredLeads.length !== 1 && "s"}
    </p>
  </div>

  {/* Filters */}
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    <input
      className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      placeholder="Search name or phone"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />

    <select
      className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All Status</option>
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option>Interested</option>
      <option>In Progress</option>
      <option value="Converted">Converted</option>
      <option value="Lost">Lost</option>
    </select>

    <button
      disabled={loading}
      onClick={fetchLeads}
      className={`px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 ${
        loading
          ? "bg-indigo-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
       Refresh
    </button>
  </div>
</div>


    {/* ================= LIST / TABLE ================= */}
   <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
  <table className="w-full border-collapse">

        {/* Desktop header only */}
     <thead className="hidden md:table-header-group bg-gray-50 text-xs text-gray-500 uppercase">
  <tr>
    <th className="p-4 font-medium">Name</th>
    <th className="p-4 font-medium">Phone</th>
    <th className="p-4 font-medium">Source</th>
    <th className="p-4 font-medium">Status</th>
    <th className="p-4 font-medium">Message</th>
    <th className="p-4 font-medium text-right">Actions</th>
  </tr>
</thead>


        <tbody className="text-sm">
          {loading && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                Loading your leads...
              </td>
            </tr>
          )}

          {!loading && filteredLeads.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No leads assigned yet.
              </td>
            </tr>
          )}

          {!loading &&
            filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                onView={() => setSelectedLead(lead)}
                onRefresh={fetchLeads}
              />
            ))}
        </tbody>
      </table>
    </div>

    {/* ================= MODAL ================= */}
    {selectedLead && (
      <LeadModal
        lead={selectedLead}
        onClose={() => {
          setSelectedLead(null);
          fetchLeads();
        }}
      />
    )}
  </div>
);

}
