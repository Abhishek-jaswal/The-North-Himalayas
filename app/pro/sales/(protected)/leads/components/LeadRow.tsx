"use client";
import React from "react";
import { pb } from "@/app/lib/pocketbase";
import { Phone, MessageCircle, X, ChevronRight } from "lucide-react";

interface Lead {
  id: string; name?: string; phone?: string; source?: string;
  status?: string; next_followup?: string; created?: string;
}

const statusMap: Record<string, { bg: string; text: string; dot: string }> = {
  "Contacted":  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  "Interested": { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400" },
  "In Progress":{ bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  "Converted":  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  "Booked":     { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-400" },
  "Lost":       { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400" },
};

const formatDT = (v?: string) => { if (!v) return "—"; return new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); };

const followUpInfo = (v?: string) => {
  if (!v) return null;
  const f = new Date(v), now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tmr = new Date(today); tmr.setDate(tmr.getDate() + 1);
  const dat = new Date(tmr); dat.setDate(dat.getDate() + 1);
  if (f < today) return { text: "Overdue", color: "text-red-600 font-bold" };
  if (f < tmr) return { text: `Today, ${f.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})}`, color: "text-indigo-600 font-semibold" };
  if (f < dat) return { text: `Tomorrow, ${f.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})}`, color: "text-slate-600 font-medium" };
  return { text: formatDT(v), color: "text-slate-500" };
};

export default function LeadRow({ lead, onView, onRefresh }: { lead: Lead; onView: () => void; onRefresh: () => void }) {
  const st = statusMap[lead.status || ""] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
  const fu = followUpInfo(lead.next_followup);

  const callNumber = () => { if (lead.phone) window.open(`tel:${lead.phone}`); };
  const openWhatsApp = () => { if (lead.phone) window.open(`https://wa.me/${lead.phone.replace(/[^\d]/g,"")}`, "_blank"); };
  const markLost = async () => {
    try {
      await pb.collection("leads").update(lead.id, { status: "Lost" });
      await pb.collection("lead_activity").create({ lead_id: lead.id, action: "Marked Lost", actor: pb.authStore.model?.email ?? "unknown" });
      onRefresh();
    } catch { alert("Failed to mark lost"); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 hover:border-slate-300 transition-colors">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shrink-0">
            {(lead.name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">{lead.name || "—"}</p>
            <p className="text-xs text-slate-400 font-mono">{lead.phone || "—"}</p>
            {fu && <p className={`text-[11px] mt-0.5 ${fu.color}`}>⏰ {fu.text}</p>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black ${st.bg} ${st.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {lead.status || "New"}
          </span>
          {lead.source && <p className="text-[10px] text-slate-400 mt-1 capitalize">{lead.source}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-50">
        <button onClick={onView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-200">
          Details <ChevronRight size={13} />
        </button>
        <button onClick={callNumber}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-100">
          <Phone size={15} />
        </button>
        <button onClick={openWhatsApp}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:scale-95 transition-all border border-green-100">
          <MessageCircle size={15} />
        </button>
        <button onClick={markLost}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-all border border-red-100">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
