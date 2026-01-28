"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  next_followup: string;
}

type Tab = "today" | "overdue" | "upcoming";

/* =======================
   DATE HELPERS (FIX)
======================= */
const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

const isToday = (dateStr?: string) => {
  if (!dateStr) return false;
  return isSameDay(new Date(dateStr), new Date());
};

const isOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();

  // remove time from today
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return d < today;
};

const isUpcoming = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return d > today;
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
        filter: `
          assigned_to="${userId}" &&
          next_followup!=null &&
          status!="Converted" &&
          status!="Lost"
        `,
        sort: "next_followup",
      });

      setAllLeads(
        res.items.map((item) => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          next_followup: item.next_followup,
        }))
      );

      setLoading(false);
    };

    load();
  }, []);

  /* =======================
     FILTERED LIST
  ======================= */
  const filtered = allLeads.filter((l) => {
    if (tab === "today") return isToday(l.next_followup);
    if (tab === "overdue") return isOverdue(l.next_followup);
    return isUpcoming(l.next_followup);
  });

  const count = (t: Tab) =>
    allLeads.filter((l) => {
      if (t === "today") return isToday(l.next_followup);
      if (t === "overdue") return isOverdue(l.next_followup);
      return isUpcoming(l.next_followup);
    }).length;

  if (loading) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Follow-ups</h1>

        <div className="flex gap-2">
          {(["today", "overdue", "upcoming"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} ({count(t)})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-300 divide-y">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No follow-ups
          </div>
        ) : (
          filtered.map((lead) => (
            <div
              key={lead.id}
              onClick={() =>
                router.push(`/pro/sales/leads/${lead.id}`)
              }
              className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <div className="font-medium text-sm">
                  {lead.name}
                </div>
                <div className="text-xs text-gray-500">
                  {lead.phone}
                </div>
              </div>

              <div className="text-xs text-gray-600">
                {new Date(lead.next_followup).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
