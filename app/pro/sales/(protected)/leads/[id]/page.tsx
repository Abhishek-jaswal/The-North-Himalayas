"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useParams, useRouter } from "next/navigation";
import { Phone, MessageCircle, CheckCircle, ChevronLeft, Clock, MapPin, DollarSign, User } from "lucide-react";

interface Lead { id: string; name: string; phone: string; status: string; next_followup?: string; }
interface Activity { id: string; action: string; actor: string; created: string; meta?: string; }

const callNumber = (phone?: string) => { if (!phone) return; window.open(`tel:${phone}`); };

const openWhatsApp = async (lead: Lead) => {
  if (!lead.phone) return;
  const cleanPhone = lead.phone.replace(/[^\d]/g, "");
  const message = `Hi ${lead.name}, following up regarding your trip…`;
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  await pb.collection("lead_activity").create({
    lead_id: lead.id, action: "WhatsApp Message Sent",
    actor: pb.authStore.model?.email ?? "unknown",
    meta: JSON.stringify({ phone: lead.phone, message }),
  });
};

const statusColors: Record<string, string> = {
  "New": "bg-slate-100 text-slate-700",
  "Contacted": "bg-amber-100 text-amber-700",
  "Interested": "bg-purple-100 text-purple-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Converted": "bg-emerald-100 text-emerald-700",
  "Lost": "bg-red-100 text-red-700",
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const [quick, setQuick] = useState({ status: "", next_followup: "", notes: "" });

  useEffect(() => {
    const load = async () => {
      const l = await pb.collection("leads").getOne(id as string);
      setLead({ id: l.id, name: l.name, phone: l.phone, status: l.status, next_followup: l.next_followup });
      setQuick({ status: l.status, next_followup: l.next_followup ? l.next_followup.slice(0, 16) : "", notes: "" });
      const a = await pb.collection("lead_activity").getList(1, 20, { filter: `lead_id="${id}"`, sort: "-created" });
      setActivity(a.items.map((i) => ({ id: i.id, action: i.action, actor: i.actor, created: i.created, meta: i.meta })));
    };
    load();
  }, [id]);

  if (!lead) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const saveQuick = async () => {
    setSaving(true);
    await pb.collection("leads").update(lead.id, {
      status: quick.status,
      next_followup: quick.next_followup ? new Date(quick.next_followup).toISOString() : null,
    });
    await pb.collection("lead_activity").create({
      lead_id: lead.id, action: "Quick Update",
      actor: pb.authStore.model?.email ?? "unknown",
      meta: JSON.stringify(quick),
    });
    setSaving(false);
    router.refresh();
  };

  const markDone = async () => {
    await pb.collection("leads").update(lead.id, { next_followup: null });
    await pb.collection("lead_activity").create({
      lead_id: lead.id, action: "Follow-up Completed", actor: pb.authStore.model?.email ?? "unknown",
    });
    router.push("/pro/sales/follow-ups");
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-black">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">{lead.name}</h1>
              <p className="text-sm text-slate-500 font-mono">{lead.phone}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[lead.status] || "bg-slate-100 text-slate-600"}`}>
            {lead.status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => callNumber(lead.phone)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 text-sm font-semibold transition-all border border-emerald-100"
          >
            <Phone size={15} /> Call
          </button>
          <button
            onClick={() => openWhatsApp(lead)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 active:scale-95 text-sm font-semibold transition-all border border-green-100"
          >
            <MessageCircle size={15} /> WhatsApp
          </button>
          <button
            onClick={markDone}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
          >
            <CheckCircle size={15} /> Done
          </button>
        </div>
      </div>

      {/* Quick Update */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Quick Update</h3>

        <select
          value={quick.status}
          onChange={(e) => setQuick({ ...quick, status: e.target.value })}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        >
          {["New","Contacted","Interested","In Progress","Converted","Lost"].map(s => <option key={s}>{s}</option>)}
        </select>

        <input
          type="datetime-local"
          value={quick.next_followup}
          onChange={(e) => setQuick({ ...quick, next_followup: e.target.value })}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        />

        <textarea
          rows={2}
          placeholder="Quick note…"
          value={quick.notes}
          onChange={(e) => setQuick({ ...quick, notes: e.target.value })}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
        />

        <button
          onClick={saveQuick}
          disabled={saving}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save Update"}
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-800 px-1">Activity Timeline</h3>
        {activity.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-sm">No activity yet</div>
        )}
        <div className="space-y-2">
          {activity.map((a) => {
            let meta: { notes?: string; status?: string; next_followup?: string; adults?: number; kids?: number; location?: string; budget?: number } = {};
            try { meta = a.meta ? JSON.parse(a.meta) : {}; } catch {}

            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-800 text-sm">{a.action}</p>
                  <p className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(a.created).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mb-2">by <strong>{a.actor}</strong></p>
                <div className="space-y-1">
                  {meta.notes      && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400">📝</span>{meta.notes}</p>}
                  {meta.status     && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400"><User size={11}/></span>Status: {meta.status}</p>}
                  {meta.next_followup && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400"><Clock size={11}/></span>{new Date(meta.next_followup).toLocaleString()}</p>}
                  {meta.location   && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400"><MapPin size={11}/></span>{meta.location}</p>}
                  {meta.budget     && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400"><DollarSign size={11}/></span>₹{meta.budget}</p>}
                  {(meta.adults || meta.kids) && <p className="text-xs text-slate-600 flex gap-2"><span className="text-slate-400">👥</span>{meta.adults ?? 0} Adults, {meta.kids ?? 0} Kids</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
