"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";

/* =======================
   HELPERS
======================= */
function getChanges(oldLead: Lead, newData: Partial<Lead>) {
  const changes: string[] = [];

  const fields: Record<string, string> = {
    name: "Name",
    phone: "Phone",
    travel_date: "Travel Date",
    location: "Location",
    days: "Days",
    nights: "Nights",
    adults: "Adults",
    kids: "Kids",
    budget: "Budget",
    status: "Status",
    next_followup: "Next Follow-up",
  };

  for (const key in fields) {
    const oldVal = (oldLead as Record<string, string | number | null | undefined>)[key] ?? "";
    const newVal = (newData as Record<string, string | number | null | undefined>)[key] ?? "";

    if (String(oldVal) !== String(newVal)) {
      changes.push(
        `${fields[key]}: ${oldVal || "—"} → ${newVal || "—"}`
      );
    }
  }

  return changes;
}

const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

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
  const [lastActivity, setLastActivity] = useState<{
    actor: string;
    details: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    travel_date: lead.travel_date
  ? new Date(lead.travel_date).toISOString().slice(0, 10)
  : "",

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
    notes: lead.notes || "",
  });

  const handle = (key: string, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* Auto nights */
  useEffect(() => {
    if (form.days > 0) {
      handle("nights", Math.max(Number(form.days) - 1, 0));
    }
  }, [form.days]);

  /* Load last activity */
  useEffect(() => {
    pb.collection("lead_activity")
      .getList(1, 1, {
        filter: `lead_id="${lead.id}"`,
        sort: "-created",
      })
      .then((res) => {
        if (res.items[0]) {
          setLastActivity({
            actor: res.items[0].actor,
            details: res.items[0].details,
          });
        }
      })
      .catch(() => {});
  }, [lead.id]);

  const save = async () => {
    setSaving(true);

    const payload = {
      ...form,
      notes: form.notes || "",
      travel_date: form.travel_date || undefined,
      next_followup: form.next_followup
        ? new Date(form.next_followup).toISOString()
        : undefined,
      days: Number(form.days),
      nights: Number(form.nights),
      adults: Number(form.adults),
      kids: Number(form.kids),
      budget: Number(form.budget),
    };

    const changes = getChanges(lead, payload);

    try {
      await pb.collection("leads").update(lead.id, payload);

      if (changes.length > 0) {
        await pb.collection("lead_activity").create({
          lead_id: lead.id,
          action: "Lead Updated",
          details: changes.join(", "),
          actor: pb.authStore.model?.email ?? "unknown",
        });
      }

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
            <div className="font-semibold text-lg">
              {form.name || "New Lead"}
            </div>
            <div className="text-sm text-gray-500">{form.phone}</div>

            {lastActivity && (
              <div className="text-xs text-gray-500 mt-1">
                Last update by <b>{lastActivity.actor}</b>
                <div className="italic">{lastActivity.details}</div>
              </div>
            )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Travel Date"
              type="date"
              value={form.travel_date}
              onChange={(v) => handle("travel_date", v)}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(v) => handle("location", v)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select
              label="Days"
              value={form.days}
              onChange={(v) => handle("days", Number(v))}
              options={range(1, 30)}
            />
            <Input label="Nights" value={form.nights} readOnly />
            <Select
              label="Adults"
              value={form.adults}
              onChange={(v) => handle("adults", Number(v))}
              options={range(1, 10)}
            />
            <Select
              label="Kids"
              value={form.kids}
              onChange={(v) => handle("kids", Number(v))}
              options={range(0, 6)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="Budget"
              type="number"
              value={form.budget}
              onChange={(v) => handle("budget", Number(v))}
            />
            <Input
              label="Next Follow-up"
              type="datetime-local"
              value={form.next_followup}
              onChange={(v) => handle("next_followup", v)}
            />
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
            rows={3}
            placeholder="Quick notes for next call…"
            value={form.notes}
            onChange={(e) => handle("notes", e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 flex gap-3 border-t border-gray-300 bg-white">
          <button
            onClick={onClose}
            className="px-5 rounded-xl bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium"
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
}: {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  options: number[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
