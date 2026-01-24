"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { Lead } from "@/app/types/lead";

/* =======================
   TYPES
======================= */
interface Activity {
  id: string;
  lead_id: string;
  action: string;
  actor: string;
  meta?: string;
  created: string;
}

const metaLabels: Record<string, string> = {
  status: "Status",
  assignedTo: "Assigned To",
  leadId: "Lead ID",
  notes: "Notes",
  next_followup: "Next Follow-up",
};

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
  const [activity, setActivity] = useState<Activity[]>([]);

  const [form, setForm] = useState({
    name: lead.name || "",
    phone: lead.phone || "",
    travel_date: lead.travel_date ? lead.travel_date.split("T")[0] : "",
    days: lead.days ?? 0,
    nights: lead.nights ?? 0,
    location: lead.location || "",
    adults: lead.adults ?? 0,
    kids: lead.kids ?? 0,
    budget: lead.budget ?? 0,
    notes: "",
    status: lead.status || "New",
    next_followup: lead.next_followup
      ? lead.next_followup.slice(0, 16) // ✅ datetime-local format
      : "",
  });

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* Auto-calc nights */
  useEffect(() => {
    if (form.days > 0) {
      setForm((s) => ({
        ...s,
        nights: Math.max(Number(s.days) - 1, 0),
      }));
    }
  }, [form.days]);

  /* Load activity */
  useEffect(() => {
    (async () => {
      try {
        const res = await pb.collection("lead_activity").getList(1, 50, {
          filter: `lead_id="${lead.id}"`,
          sort: "-created",
        });

        setActivity(
          res.items.map((item) => ({
            id: item.id,
            lead_id: item.lead_id,
            action: item.action,
            actor: item.actor,
            meta: item.meta,
            created: item.created,
          }))
        );
      } catch (err) {
        console.error("Activity load error", err);
      }
    })();
  }, [lead.id]);

  /* Save */
  const save = async () => {
    setSaving(true);
    try {
      await pb.collection("leads").update(lead.id, {
        ...form,
        travel_date: form.travel_date || null,
        next_followup: form.next_followup || null,
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
        meta: JSON.stringify({
          notes: form.notes,
          next_followup: form.next_followup,
        }),
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40">
      <div className="ml-auto w-full md:w-[820px] h-full bg-white flex flex-col shadow-2xl">
        {/* HEADER */}
        <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{form.name}</h2>
            <div className="text-sm text-gray-500">{form.phone}</div>
          </div>

          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Converted</option>
            <option>Lost</option>
          </select>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-5">
            <Section title="Trip Details">
              <Input label="Travel Date" type="date" value={form.travel_date} onChange={(v) => handleChange("travel_date", v)} />
              <Input label="Days" type="number" value={form.days} onChange={(v) => handleChange("days", v)} />
              <Input label="Nights" type="number" value={form.nights} readOnly />
              <Input label="Location" value={form.location} onChange={(v) => handleChange("location", v)} />
            </Section>

            <Section title="Passengers & Budget">
              <Input label="Adults" type="number" value={form.adults} onChange={(v) => handleChange("adults", v)} />
              <Input label="Kids" type="number" value={form.kids} onChange={(v) => handleChange("kids", v)} />
              <Input label="Budget" type="number" value={form.budget} onChange={(v) => handleChange("budget", v)} />
            </Section>

            <Section title="Follow-up">
              <Input
                label="Next Follow-up (Date & Time)"
                type="datetime-local"
                value={form.next_followup}
                onChange={(v) => handleChange("next_followup", v)}
              />
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm"
                rows={4}
                placeholder="Add follow-up notes..."
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Section>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <Section title="Activity Timeline">
              {activity.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">
                  No activity yet
                </div>
              ) : (
                <div className="space-y-4">
                  {activity.map((a) => {
                    let meta: Record<string, unknown> = {};
                    try {
                      meta = a.meta ? JSON.parse(a.meta) : {};
                    } catch {}

                    return (
                      <div key={a.id} className="inline-block  flex max-w-full text-xs  border-gray-300 rounded-lg p-3">
                        <div className="font-semibold mb-1">{a.action}</div>

                        {Object.entries(meta)
                          .filter(([key]) => key in metaLabels)
                          .map(([k, v]) => (
                            <div key={k} className=" justify-between gap-2">
                              <span className="text-gray-500">{metaLabels[k]}</span>
                              <span>
                                {k === "next_followup"
                                  ? new Date(String(v)).toLocaleString()
                                  : String(v)}
                              </span>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-4 flex justify-between">
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {saving ? "Saving..." : "Submit"}
          </button>

          <button onClick={onClose} className="px-5 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   UI HELPERS
======================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <h4 className="text-xs font-semibold uppercase mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

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
      <label className="text-xs font-medium">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm ${
          readOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}
