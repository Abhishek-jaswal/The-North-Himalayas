"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";

/* =======================
   COMPONENT
======================= */
export default function LeadModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    travel_date: lead.travel_date ? lead.travel_date.split("T")[0] : "",
    days: lead.days ?? 3,
    nights: lead.nights ?? 2,
    location: lead.location || "",
    adults: lead.adults ?? 2,
    kids: lead.kids ?? 0,
    budget: lead.budget ?? 0,
    status: lead.status || "New",
    next_followup: lead.next_followup
      ? lead.next_followup.slice(0, 16)
      : "",
    notes: "",
  });

  const handle = (key: string, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* Auto nights */
  useEffect(() => {
    if (form.days > 0) {
      handle("nights", Math.max(Number(form.days) - 1, 0));
    }
  }, [form.days]);

  const save = async () => {
    setSaving(true);
    try {
      await pb.collection("leads").update(lead.id, {
        ...form,
        travel_date: form.travel_date || null,
        next_followup: form.next_followup
          ? new Date(form.next_followup).toISOString()
          : null,
        days: Number(form.days),
        nights: Number(form.nights),
        adults: Number(form.adults),
        kids: Number(form.kids),
        budget: Number(form.budget),
      });

      await pb.collection("lead_activity").create({
        lead_id: lead.id,
        action: "Lead Updated",
        actor: pb.authStore.model?.email ?? "unknown",
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[95vh]">

        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-300 flex justify-between items-center">
          <div>
            <div className="font-semibold text-lg">{form.name || "New Lead"}</div>
            <div className="text-sm text-gray-500">{form.phone}</div>
          </div>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => handle("status", e.target.value)}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Interested</option>
            <option>In Progress</option>
            <option>Converted</option>
            <option>Lost</option>
          </select>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-auto px-5 py-6 space-y-6">

          {/* QUICK INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Travel Date" type="date" value={form.travel_date} onChange={(v: string) => handle("travel_date", v)} />
            <Input label="Location" value={form.location} onChange={(v: string) => handle("location", v)} />
          </div>

          {/* TRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select label="Days" value={form.days} onChange={(v: string) => handle("days", Number(v))} options={range(1, 30)} />
            <Input label="Nights" value={form.nights} readOnly />
            <Select label="Adults" value={form.adults} onChange={(v: string) => handle("adults", Number(v))} options={range(1, 10)} />
            <Select label="Kids" value={form.kids} onChange={(v: string) => handle("kids", Number(v))} options={range(0, 6)} />
          </div>

          {/* BUDGET */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Budget" type="number" value={form.budget} onChange={(v: string) => handle("budget", Number(v))} />
            <Input
              label="Next Follow-up"
              type="datetime-local"
              value={form.next_followup}
              onChange={(v: string) => handle("next_followup", v)}
            />
          </div>

          {/* NOTES */}
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
            rows={3}
            placeholder="Quick notes for next call…"
            value={form.notes}
            onChange={(e) => handle("notes", e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="border border-gray-300-t px-5 py-4 flex gap-3 sticky bottom-0 bg-white">
              <button
            onClick={onClose}
            className="px-5 rounded-xl  bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className=" bg-indigo-600 text-white rounded-xl p-3 font-medium"
          >
            {saving ? "Saving…" : "Submit"}
          </button>
      
        </div>
      </div>
    </div>
  );
}

/* =======================
   UI COMPONENTS
======================= */
function Input({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: { label: string; value: string | number; onChange?: (value: string) => void; type?: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full border border-gray-300 rounded-xl px-3 py-2 ${
          readOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: number; onChange: (value: string) => void; options: number[] }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2"
      >
        {options.map((o: number) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);
