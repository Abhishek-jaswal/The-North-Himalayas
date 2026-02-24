"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useParams, useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  next_followup?: string;
}

interface Activity {
  id: string;
  action: string;
  actor: string;
  created: string;
  meta?: string;
}

const callNumber = (phone?: string) => {
  if (!phone) return;
  window.open(`tel:${phone}`);
};

const openWhatsApp = async (lead: Lead) => {
  if (!lead.phone) return;

  const cleanPhone = lead.phone.replace(/[^\d]/g, "");
  const message = `Hi ${lead.name}, following up regarding your trip…`;
  const encodedMessage = encodeURIComponent(message);

  // Open WhatsApp
  window.open(
    `https://wa.me/${cleanPhone}?text=${encodedMessage}`,
    "_blank"
  );

  // Save activity
  await pb.collection("lead_activity").create({
    lead_id: lead.id,
    action: "WhatsApp Message Sent",
    actor: pb.authStore.model?.email ?? "unknown",
    meta: JSON.stringify({
      phone: lead.phone,
      message,
    }),
  });
};


export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [quick, setQuick] = useState({
    status: "",
    next_followup: "",
    notes: "",
  });

  useEffect(() => {
    const load = async () => {
      const l = await pb.collection("leads").getOne(id as string);
      setLead({
        id: l.id,
        name: l.name,
        phone: l.phone,
        status: l.status,
        next_followup: l.next_followup,
      });

      setQuick({
        status: l.status,
        next_followup: l.next_followup
          ? l.next_followup.slice(0, 16)
          : "",
        notes: "",
      });

      const a = await pb.collection("lead_activity").getList(1, 20, {
        filter: `lead_id="${id}"`,
        sort: "-created",
      });

setActivity(
  a.items.map((i) => ({
    id: i.id,
    action: i.action,
    actor: i.actor,
    created: i.created,
    meta: i.meta,
  }))
);

    };

    load();
  }, [id]);

  if (!lead) return <div className="p-6">Loading…</div>;

  const saveQuick = async () => {
    await pb.collection("leads").update(lead.id, {
      status: quick.status,
      next_followup: quick.next_followup
        ? new Date(quick.next_followup).toISOString()
        : null,
    });

    await pb.collection("lead_activity").create({
      lead_id: lead.id,
      action: "Quick Update",
      actor: pb.authStore.model?.email ?? "unknown",
      meta: JSON.stringify(quick),
    });

    router.refresh();
  };

  const markDone = async () => {
    await pb.collection("leads").update(lead.id, {
      next_followup: null,
    });

    await pb.collection("lead_activity").create({
      lead_id: lead.id,
      action: "Follow-up Completed",
      actor: pb.authStore.model?.email ?? "unknown",
    });

    router.push("/pro/sales/follow-ups");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      {/* Header */}
    {/* Header */}
<div className="flex justify-between items-center gap-3">
  <div>
    <h1 className="text-xl font-semibold">{lead.name}</h1>
    <div className="text-sm text-gray-500">{lead.phone}</div>
  </div>

  <div className="flex items-center gap-2">
    {/* Call */}
    <button
      onClick={() => callNumber(lead.phone)}
      className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      title="Call"
    >
      📞
    </button>

    {/* WhatsApp */}
  <button
    onClick={() => openWhatsApp(lead)}
    className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
    title="WhatsApp"
  >
    💬
  </button>

    {/* Done */}
    <button
      onClick={markDone}
      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
    >
      ✅ Done
    </button>
  </div>
</div>


      {/* Quick Update */}
      <div className="bg-white rounded-xl border border-gray-300 border border-gray-300-gray-300 p-4 space-y-3">
        <h3 className="font-medium">Quick Update</h3>

        <select
          value={quick.status}
          onChange={(e) =>
            setQuick({ ...quick, status: e.target.value })
          }
          className="w-full border border-gray-300 border border-gray-300-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Interested</option>
          <option>In Progress</option>
          <option>Converted</option>
          <option>Lost</option>
        </select>

        <input
          type="datetime-local"
          value={quick.next_followup}
          onChange={(e) =>
            setQuick({ ...quick, next_followup: e.target.value })
          }
          className="w-full border border-gray-300 border border-gray-300-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <textarea
          rows={2}
          placeholder="Quick note…"
          value={quick.notes}
          onChange={(e) =>
            setQuick({ ...quick, notes: e.target.value })
          }
          className="w-full border border-gray-300 border border-gray-300-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={saveQuick}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm"
        >
          Save
        </button>
      </div>

      {/* Activity */}
      {/* Activity */}
<div className="space-y-3">
  <h3 className="font-medium">Activity</h3>

  {activity.map((a) => {
    let meta: {
      notes?: string;
      status?: string;
      next_followup?: string;
      adults?: number;
      kids?: number;
      location?: string;
      budget?: number;
    } = {};
    try {
      meta = a.meta ? JSON.parse(a.meta) : {};
    } catch {}

    return (
      <div
        key={a.id}
        className="text-sm border border-gray-300 border border-gray-300-gray-300 rounded-lg p-3 space-y-1"
      >
        <div className="font-medium">{a.action}</div>

        {/* DETAILS */}
        {meta.notes && (
          <div className="text-gray-700">
            📝 <strong>Note:</strong> {meta.notes}
          </div>
        )}

        {meta.status && (
          <div className="text-gray-600">
            📌 Status: <strong>{meta.status}</strong>
          </div>
        )}

        {meta.next_followup && (
          <div className="text-gray-600">
            ⏰ Follow-up:{" "}
            {new Date(meta.next_followup).toLocaleString()}
          </div>
        )}

        {(meta.adults || meta.kids) && (
          <div className="text-gray-600">
            👥 Travellers:{" "}
            {meta.adults ?? 0} Adults, {meta.kids ?? 0} Kids
          </div>
        )}

        {meta.location && (
          <div className="text-gray-600">
            📍 Location: {meta.location}
          </div>
        )}

        {meta.budget && (
          <div className="text-gray-600">
            💰 Budget: ₹{meta.budget}
          </div>
        )}

        <div className="text-xs text-gray-400 pt-1">
          {new Date(a.created).toLocaleString()}
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
