"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  next_followup?: string;
  assigned_to: string;
}

type Tab = "today" | "overdue" | "upcoming";

export default function FollowUpsPage() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("today");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔑 Local date helper (timezone safe)
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const fetchFollowups = async () => {
    try {
      if (!pb.authStore.isValid) {
        router.push("/pro/sales/login");
        return;
      }

      const salespersonId = pb.authStore.model?.id;
      if (!salespersonId) return;

      const res = await pb.collection("leads").getList(1, 200, {
        filter: `
          assigned_to = "${salespersonId}" &&
          next_followup != null &&
          status != "Converted" &&
          status != "Lost"
        `,
        sort: "next_followup",
      });

      const today = getLocalDate();

      let filtered: Lead[] = [];

      if (tab === "today") {
        filtered = res.items.filter(
          l => l.next_followup?.split("T")[0] === today
        );
      }

      if (tab === "overdue") {
        filtered = res.items.filter(
          l => l.next_followup!.split("T")[0] < today
        );
      }

      if (tab === "upcoming") {
        filtered = res.items.filter(
          l => l.next_followup!.split("T")[0] > today
        );
      }

      setLeads(filtered as Lead[]);
    } catch (err) {
      console.error("Failed to load follow-ups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, [tab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading follow-ups...
      </div>
    );
  }

  return (
    <div className="flex-1 ml-0 md:ml-64 p-4 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-xl font-bold">Follow-ups</h1>

        <div className="flex gap-2">
          <TabButton label="Today" active={tab === "today"} onClick={() => setTab("today")} />
          <TabButton label="Overdue" active={tab === "overdue"} onClick={() => setTab("overdue")} />
          <TabButton label="Upcoming" active={tab === "upcoming"} onClick={() => setTab("upcoming")} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        {leads.length === 0 ? (
          <p className="p-4 text-gray-500">No follow-ups</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Follow-up Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/pro/sales/leads/${lead.id}`)
                  }
                >
                  <td className="p-2 font-medium">{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td className="capitalize">{lead.source}</td>
                  <td className="capitalize">{lead.status}</td>
                  <td className="text-red-600">
                    {lead.next_followup?.split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

/* ---------- Small Components ---------- */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition
        ${
          active
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      {label}
    </button>
  );
}
