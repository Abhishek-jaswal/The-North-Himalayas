"use client";
import React from "react";
import { pb } from "@/app/lib/pocketbase";

interface Lead {
  id: string;
  name?: string;
  phone?: string;
  source?: string;
  status?: string;
  message?: string;
  assigned_to?: string;
  next_followup?: string; // ISO string
  created?: string; // PocketBase default
}

function statusColor(status?: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    case "Interested":
      return "bg-purple-100 text-purple-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Converted":
      return "bg-green-100 text-green-700";
    case "Lost":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* ================= DATE HELPERS ================= */
const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const isOverdue = (value?: string) => {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
};

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

  /* ================= DESKTOP ROW ================= */
  return (
    <>
      <tr className="hidden md:table-row border-t hover:bg-gray-50 transition">
        <td className="p-4">
          <div className="font-medium">{lead.name || "—"}</div>
          <div className="text-sm text-gray-500">{lead.phone}</div>
        </td>

        <td className="p-4 text-sm text-gray-600">{lead.source || "—"}</td>

        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
              lead.status
            )}`}
          >
            {lead.status || "New"}
          </span>
        </td>

        <td className="p-4 text-sm">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              isOverdue(lead.next_followup)
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            ⏰ {formatDateTime(lead.next_followup)}
          </div>
        </td>

        <td className="p-4 text-sm text-gray-500">
          🗓 {formatDateTime(lead.created)}
        </td>

        <td className="p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={onView}
              className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100"
            >
              View
            </button>
            <button
              onClick={() => callNumber(lead.phone)}
              className="h-8 w-8 border rounded-md hover:bg-gray-100"
            >
              📞
            </button>
            <button
              onClick={() => openWhatsApp(lead.phone)}
              className="h-8 w-8 border rounded-md hover:bg-gray-100"
            >
              💬
            </button>
            <button
              onClick={markLost}
              className="h-8 w-8 border rounded-md text-red-600 hover:bg-red-50"
            >
              🗑
            </button>
          </div>
        </td>
      </tr>

      {/* ================= MOBILE CARD ================= */}
      <div className="md:hidden bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{lead.name}</h3>
            <p className="text-sm text-gray-500">{lead.phone}</p>
            <p className="text-xs text-gray-400">
              Source: {lead.source || "—"}
            </p>
          </div>

          <span
            className={`px-3 py-1 h-fit rounded-full text-xs font-semibold ${statusColor(
              lead.status
            )}`}
          >
            {lead.status}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div
            className={`px-3 py-2 rounded-lg ${
              isOverdue(lead.next_followup)
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            ⏰ Follow-up: {formatDateTime(lead.next_followup)}
          </div>

          <div className="px-3 py-2 rounded-lg bg-gray-50 text-gray-600">
            🗓 Assigned: {formatDateTime(lead.created)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onView}
            className="h-11 rounded-lg border hover:bg-gray-100"
          >
            View
          </button>
          <button
            onClick={() => callNumber(lead.phone)}
            className="h-11 rounded-lg border hover:bg-gray-100"
          >
            📞 Call
          </button>
          <button
            onClick={() => openWhatsApp(lead.phone)}
            className="h-11 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            WhatsApp
          </button>
          <button
            onClick={markLost}
            className="h-11 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Mark Lost
          </button>
        </div>
      </div>
    </>
  );
}
