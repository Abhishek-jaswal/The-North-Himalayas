"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";

import LeadRow from "./components/LeadRow";
import LeadModal from "./components/LeadModal";

/* =======================
   TYPES
======================= */
type Lead = {
  id: string;
  name: string;
  phone: string;
  source?: string;
  status?: string;
  travel_date?: string;
  days?: number;
  nights?: number;
  location?: string;
  adults?: number;
  kids?: number;
  budget?: number;
  notes?: string;
  next_followup?: string;
  assigned_to?: string;
  created: string;
};

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
    <div className="flex-1 ml-0 md:ml-64 p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Leads</h2>
        
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            className="border rounded px-3 py-2 w-52"
            placeholder="Search name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <button
            disabled={loading}
            onClick={fetchLeads}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-left text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Follow-up</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  Loading your leads...
                </td>
              </tr>
            )}

            {!loading && filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
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

      {/* Modal */}
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
