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

  /* ================= DESKTOP TABLE ROW ================= */
  return (
    <>
      <tr className="hidden md:table-row border-t border-gray-300 hover:bg-gray-50 transition">
  <td className="p-4 font-medium">{lead.name || "—"}</td>
  <td className="p-4 text-gray-600">{lead.phone || "—"}</td>
  <td className="p-4 text-gray-600">{lead.source || "—"}</td>

  <td className="p-4">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
        lead.status
      )}`}
    >
      {lead.status || "New"}
    </span>
  </td>

  <td className="p-4 text-gray-600">
   {lead.message || "—"}
  </td>

  <td className="p-4">
    <div className="flex justify-end gap-2 ">
      <button
        onClick={onView}
        className="px-3 py-1  cursor-pointer text-xs border border-gray-400 rounded-md hover:bg-gray-100"
      >
        View
      </button>
      <button
        onClick={() => callNumber(lead.phone)}
        className="h-8 w-8 flex items-center justify-center border border-gray-400  cursor-pointer rounded-md hover:bg-gray-100"
      >
        📞
      </button>
      <button
        onClick={() => openWhatsApp(lead.phone)}
        className="h-8 w-8 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 cursor-pointer"
      >
        💬
      </button>
      <button
        onClick={markLost}
        className="h-8 w-8 flex items-center justify-center cursor-pointer border border-gray-400 rounded-md text-red-600 hover:bg-red-50"
      >
        🗑
      </button>
    </div>
  </td>
</tr>


     {/* ================= MOBILE CARD (PRO UX) ================= */}
     <div className=" md:hidden bg-white rounded-xl border shadow-sm p-4 space-y-4">
  {/* Header */}
  <div className="flex justify-between items-start gap-2">
    <div>
      <h3 className="text-base font-semibold leading-tight">
        {lead.name || "—"}
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        {lead.phone || "—"}
      </p>
      <p className="text-xs text-gray-500">
        Source: {lead.source || "—"}
      </p>
    </div>

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(
        lead.status
      )}`}
    >
      {lead.status || "New"}
    </span>
  </div>

  {/* Meta */}
  <div className="text-sm text-gray-600 flex justify-between">
    <span>
      Follow-up:
      <strong className="ml-1 text-gray-800">
        {lead.message}
      </strong>
    </span>
  </div>

  {/* Actions */}
  <div className="grid grid-cols-2 gap-3 pt-2">
    <button
      onClick={onView}
      className="h-11 rounded-lg border text-sm font-medium hover:bg-gray-100"
    >
      View
    </button>

    <button
      onClick={() => callNumber(lead.phone)}
      className="h-11 rounded-lg border text-sm hover:bg-gray-100"
    >
      📞 Call
    </button>

    <button
      onClick={() => openWhatsApp(lead.phone)}
      className="h-11 rounded-lg border text-sm hover:bg-gray-100"
    >
      💬 WhatsApp
    </button>

    <button
      onClick={markLost}
      className="h-11 rounded-lg border text-sm text-red-600 hover:bg-red-50"
    >
      ❌ Mark Lost
    </button>
  </div>
</div>

    </>
  );
}
