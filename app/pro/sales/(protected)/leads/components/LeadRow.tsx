"use client";
import React from "react";
import { pb } from "@/app/lib/pocketbase";

interface Lead {
  id: string;
  name?: string;
  phone?: string;
  source?: string;
  status?: string;
  assigned_to?: string;
  next_followup?: string;
}

function statusColor(status?: string) {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "Qualified":
      return "bg-purple-100 text-purple-700";
    case "Converted":
      return "bg-green-100 text-green-700";
    case "Lost":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function LeadRow({
  lead,
  onView,
  onRefresh,
}: {
  lead: Lead;
  onView: () => void;
  onRefresh: () => void;
}) {
  const callNumber = (num?: string) => {
    if (!num) return;
    window.open(`tel:${num}`);
  };

  const openWhatsApp = (num?: string) => {
    if (!num) return;
    const phone = num.replace(/[^\d]/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const markLost = async () => {
    try {
      await pb.collection("leads").update(lead.id, { status: "Lost" });
      await pb.collection("lead_activity").create({
        lead_id: lead.id,
        action: "Marked Lost",
        actor: pb.authStore.model?.email ?? "unknown",
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to mark lost");
    }
  };

  return (
    <tr className="border-t">
      <td className="p-3">{lead.name || "—"}</td>
      <td className="p-3">{lead.phone || "—"}</td>
      <td className="p-3">{lead.source || "—"}</td>
      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-sm ${statusColor(lead.status)}`}
        >
          {lead.status || "New"}
        </span>
      </td>
      <td className="p-3">{lead.assigned_to || "Unassigned"}</td>
      <td className="p-3">
        {lead.next_followup ? new Date(lead.next_followup).toLocaleDateString() : "—"}
      </td>
      <td className="p-3 flex gap-2">
        <button className="px-3 py-1 border rounded" onClick={onView}>
          View
        </button>
        <button className="px-2 py-1 border rounded" onClick={() => callNumber(lead.phone)}>
          📞
        </button>
        <button className="px-2 py-1 border rounded" onClick={() => openWhatsApp(lead.phone)}>
          💬
        </button>
        <button className="px-2 py-1 border rounded text-red-600" onClick={markLost}>
          ❌
        </button>
      </td>
    </tr>
  );
}
