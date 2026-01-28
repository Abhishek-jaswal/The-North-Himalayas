




"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";

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
  const d = new Date(dateStr);
  const now = new Date();

  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!user?.id) {
      router.replace("/sales/login");
    }
  }, [router, user]);

  /* ================= FETCH ================= */
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

  useEffect(() => {
    (async () => {
      await fetchLeads();
    })();
  }, [fetchLeads]);

  /* ================= DASHBOARD FILTER ================= */
 const dashboardFiltered = useMemo(() => {
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  switch (type) {
    case "monthly":
      return leads.filter((l) => new Date(l.created) >= monthStart);

    case "today":
      return leads.filter((l) => isToday(l.created));

    case "followups":
      return leads.filter(
        (l) =>
          isToday(l.next_followup) &&
          l.status &&
          !["Converted", "Lost"].includes(l.status)
      );

    case "converted":
      return leads.filter((l) => l.status === "Converted");

    case "booked":
      return leads.filter(
        (l) =>
          l.status === "Booked" &&
          new Date(l.created) >= monthStart
      );

    case "pending":
      return leads.filter((l) => l.status === "New");

    case "lost":
      return leads.filter((l) => l.status === "Lost");

    default:
      return leads;
  }
}, [leads, type]);


  /* ================= SEARCH + STATUS ================= */
  const filteredLeads = useMemo(() => {
    return dashboardFiltered.filter((lead) => {
      const matchesQuery =
        !query ||
        lead.name?.toLowerCase().includes(query.toLowerCase()) ||
        lead.phone?.includes(query);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [dashboardFiltered, query, statusFilter]);

  /* ================= RENDER ================= */
  return (
    <div className="flex-1 ml-0 md:ml-64 p-3 md:p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold">My Leads</h2>
        <p className="text-sm text-gray-500">
          Showing {filteredLeads.length} leads
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="border rounded-lg px-3 py-2 text-sm"
          placeholder="Search name or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm"
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

      <table className="w-full">
        <tbody>
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
