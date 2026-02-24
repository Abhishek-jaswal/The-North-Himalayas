"use client";
import React from "react";
import { pb } from "@/app/lib/pocketbase";
import { Phone, MessageCircle, X, ChevronRight } from "lucide-react";

interface Lead {
  id: string;
  name?: string;
  phone?: string;
  source?: string;
  status?: string;
  message?: string;
  assigned_to?: string;
  next_followup?: string;
  created?: string;
}

const statusStyle = (status?: string): { bg: string; text: string; dot: string } => {
  switch (status) {
    case "Contacted":  return { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" };
    case "Interested": return { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-500" };
    case "In Progress":return { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" };
    case "Converted":  return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "Lost":       return { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400" };
    default:           return { bg: "bg-slate-100",  text: "text-slate-600",   dot: "bg-slate-400" };
  }
};

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const getFollowUpText = (value?: string) => {
  if (!value) return null;
  const follow = new Date(value);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow); dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  if (follow < today) return { text: "Overdue", color: "text-red-600" };
  if (follow >= today && follow < tomorrow)
    return { text: `Today, ${follow.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`, color: "text-indigo-600" };
  if (follow >= tomorrow && follow < dayAfterTomorrow)
    return { text: `Tomorrow, ${follow.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`, color: "text-slate-600" };
  return { text: formatDateTime(value), color: "text-slate-500" };
};

export default function LeadRow({ lead, onView, onRefresh }: { lead: Lead; onView: () => void; onRefresh: () => void }) {
  const st = statusStyle(lead.status);
  const followUp = getFollowUpText(lead.next_followup);

  const callNumber = (num?: string) => { if (!num) return; window.open(`tel:${num}`); };
  const openWhatsApp = (num?: string) => {
    if (!num) return;
    window.open(`https://wa.me/${num.replace(/[^\d]/g, "")}`, "_blank");
  };

  const markLost = async () => {
    try {
      await pb.collection("leads").update(lead.id, { status: "Lost" });
      await pb.collection("lead_activity").create({
        lead_id: lead.id, action: "Marked Lost", actor: pb.authStore.model?.email ?? "unknown",
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to mark lost");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            {(lead.name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">{lead.name || "—"}</p>
            <p className="text-xs text-slate-500 font-mono">{lead.phone || "—"}</p>
            {followUp && (
              <p className={`text-[11px] font-medium mt-0.5 ${followUp.color}`}>
                ⏰ {followUp.text}
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${st.bg} ${st.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {lead.status || "New"}
          </span>
          <p className="text-[10px] text-slate-400 mt-1 capitalize">{lead.source || "—"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-50">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold transition-all"
        >
          View Details <ChevronRight size={13} />
        </button>
        <button
          onClick={() => callNumber(lead.phone)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-100"
        >
          <Phone size={15} />
        </button>
        <button
          onClick={() => openWhatsApp(lead.phone)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:scale-95 transition-all border border-green-100"
        >
          <MessageCircle size={15} />
        </button>
        <button
          onClick={markLost}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-all border border-red-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
