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

/* ================= STATUS COLORS ================= */
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

const getFollowUpText = (value?: string) => {
  if (!value) return null;

  const follow = new Date(value);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  if (follow < today) return "Overdue";

  if (follow >= today && follow < tomorrow) {
    return `Today, ${follow.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (follow >= tomorrow && follow < dayAfterTomorrow) {
    return `Tomorrow, ${follow.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return formatDateTime(value);
};

const followUpTextColor = (value?: string) => {
  if (!value) return "text-gray-600";
  if (new Date(value) < new Date()) return "text-red-600 font-semibold";
  return "text-gray-700 font-medium";
};

/* ================= COMPONENT ================= */
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 space-y-3 mb-1">
      {/* TOP ROW */}
      <div className="flex justify-between items-start border-b pb-3 border-gray-200">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">
            {lead.name?.charAt(0) || "?"}
          </div>

          {/* Name + Meta */}
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {lead.name || "—"}
            </p>
            <p className="text-xs text-gray-500">
              {lead.phone || "—"}
            </p>

            <p className="text-[11px] text-gray-400 mt-1 flex gap-2 flex-wrap">
              <span>
                SOURCE:{" "}
                <span className="text-gray-600">
                  {lead.source || "—"}
                </span>
              </span>

              {lead.next_followup && (
                <span>
                  FOLLOW-UP:{" "}
                  <span className={followUpTextColor(lead.next_followup)}>
                    {getFollowUpText(lead.next_followup)}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Status + Created */}
        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
              lead.status
            )}`}
          >
            {lead.status || "New"}
          </span>

          <div className="text-[11px] text-gray-600 mt-1">
            Assign On:{" "}
            <span className="text-gray-700 font-medium">
              {formatDateTime(lead.created)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onView}
          className="w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <span className="text-gray-400">›</span> View Details
        </button>

        <button
          onClick={() => callNumber(lead.phone)}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          📞
        </button>

        <button
          onClick={() => openWhatsApp(lead.phone)}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          💬
        </button>

        <button
          onClick={markLost}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
