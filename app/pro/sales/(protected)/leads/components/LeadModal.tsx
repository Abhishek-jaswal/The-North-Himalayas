"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";
import { X, Save } from "lucide-react";

function getChanges(oldLead: Lead, newData: Partial<Lead>) {
  const changes: string[] = [];
  const fields: Record<string, string> = {
    name: "Name", phone: "Phone", travel_date: "Travel Date", location: "Location",
    days: "Days", nights: "Nights", adults: "Adults", kids: "Kids",
    budget: "Budget", status: "Status", next_followup: "Next Follow-up",
  };
  for (const key in fields) {
    const oldVal = (oldLead as Record<string, string | number | null | undefined>)[key] ?? "";
    const newVal = (newData as Record<string, string | number | null | undefined>)[key] ?? "";
    if (String(oldVal) !== String(newVal)) changes.push(`${fields[key]}: ${oldVal || "—"} → ${newVal || "—"}`);
  }
  return changes;
}

const range = (min: number, max: number) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

const statusColors: Record<string, string> = {
  "New": "bg-slate-100 text-slate-700",
  "Contacted": "bg-amber-100 text-amber-700",
  "Interested": "bg-purple-100 text-purple-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Converted": "bg-emerald-100 text-emerald-700",
  "Lost": "bg-red-100 text-red-700",
};

export default function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [lastActivity, setLastActivity] = useState<{ actor: string; details: string } | null>(null);

  const [form, setForm] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    travel_date: lead.travel_date ? new Date(lead.travel_date).toISOString().slice(0, 10) : "",
    days: lead.days ?? 3,
    nights: lead.nights ?? 2,
    location: lead.location || "",
    adults: lead.adults ?? 2,
    kids: lead.kids ?? 0,
    budget: lead.budget ?? 0,
    status: lead.status || "New",
    next_followup: lead.next_followup ? lead.next_followup.slice(0, 16) : "",
    notes: lead.notes || "",
  });

  const handle = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    if (form.days > 0) handle("nights", Math.max(Number(form.days) - 1, 0));
  }, [form.days]);

  useEffect(() => {
    pb.collection("lead_activity").getList(1, 1, { filter: `lead_id="${lead.id}"`, sort: "-created" })
      .then((res) => {
        if (res.items[0]) setLastActivity({ actor: res.items[0].actor, details: res.items[0].details });
      }).catch(() => {});
  }, [lead.id]);

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      notes: form.notes || "",
      travel_date: form.travel_date || undefined,
      next_followup: form.next_followup ? new Date(form.next_followup).toISOString() : undefined,
      days: Number(form.days), nights: Number(form.nights),
      adults: Number(form.adults), kids: Number(form.kids), budget: Number(form.budget),
    };
    const changes = getChanges(lead, payload);
    try {
      await pb.collection("leads").update(lead.id, payload);
      if (changes.length > 0) {
        await pb.collection("lead_activity").create({
          lead_id: lead.id, action: "Lead Updated", details: changes.join(", "),
          actor: pb.authStore.model?.email ?? "unknown",
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {(form.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{form.name || "Lead"}</p>
                <p className="text-xs text-slate-500 font-mono">{form.phone}</p>
              </div>
            </div>
            {lastActivity && (
              <p className="text-[11px] text-slate-400 mt-2 ml-13">
                Last update by <strong>{lastActivity.actor}</strong>: {lastActivity.details}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[form.status] || "bg-slate-100 text-slate-700"}`}>
              {form.status}
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-5 py-5 space-y-5">
          {/* Status */}
          <FieldGroup label="Status">
            <select
              className="field-base"
              value={form.status}
              onChange={(e) => handle("status", e.target.value)}
            >
              {["New","Contacted","Interested","In Progress","Converted","Lost"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FieldGroup>

          {/* Trip Details */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Travel Date">
              <input type="date" value={form.travel_date} onChange={(e) => handle("travel_date", e.target.value)} className="field-base" />
            </FieldGroup>
            <FieldGroup label="Location">
              <input type="text" value={form.location} onChange={(e) => handle("location", e.target.value)} placeholder="Destination" className="field-base" />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <FieldGroup label="Days">
              <select value={form.days} onChange={(e) => handle("days", Number(e.target.value))} className="field-base">
                {range(1, 30).map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Nights">
              <input type="number" value={form.nights} readOnly className="field-base bg-slate-50 cursor-not-allowed" />
            </FieldGroup>
            <FieldGroup label="Adults">
              <select value={form.adults} onChange={(e) => handle("adults", Number(e.target.value))} className="field-base">
                {range(1, 10).map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Kids">
              <select value={form.kids} onChange={(e) => handle("kids", Number(e.target.value))} className="field-base">
                {range(0, 6).map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Budget (₹)">
              <input type="number" value={form.budget} onChange={(e) => handle("budget", Number(e.target.value))} className="field-base" />
            </FieldGroup>
            <FieldGroup label="Next Follow-up">
              <input type="datetime-local" value={form.next_followup} onChange={(e) => handle("next_followup", e.target.value)} className="field-base" />
            </FieldGroup>
          </div>

          <FieldGroup label="Notes">
            <textarea
              className="field-base resize-none"
              rows={3}
              placeholder="Quick notes for next call…"
              value={form.notes}
              onChange={(e) => handle("notes", e.target.value)}
            />
          </FieldGroup>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:opacity-70"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .field-base { @apply w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition; }
      `}</style>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}
