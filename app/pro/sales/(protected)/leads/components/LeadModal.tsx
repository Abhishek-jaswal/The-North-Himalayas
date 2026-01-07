"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";

interface Lead {
  id: string;
  name: string;
  phone: string;
  travel_date?: string;
  days?: number;
  nights?: number;
  location: string;
  adults?: number;
  kids?: number;
  budget?: number;
  notes: string;
  status: string;
  next_followup?: string;
}

interface Activity {
  id: string;
  lead_id: string;
  action: string;
  actor: string;
  meta?: string;
  created: string;
}

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
    notes: lead.notes || "",
    status: lead.status || "New",
    next_followup: lead.next_followup
      ? lead.next_followup.split("T")[0]
      : "",
  });

  const handleChange = (k: string, v: string | number) =>
    setForm((s) => ({ ...s, [k]: v }));

  /* Auto calculate nights */
  useEffect(() => {
    if (form.days > 0) {
      setForm((s) => ({ ...s, nights: Math.max(Number(s.days) - 1, 0) }));
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
        setActivity(res.items as unknown as Activity[]);
      } catch (err) {
        console.error("Activity load error", err);
      }
    })();
  }, [lead.id]);

  /* Save Lead */
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
        meta: JSON.stringify(form), // IMPORTANT FIX
      });

      onClose();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("SAVE ERROR:", error);
      alert(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* Mark Contacted */
  const markContacted = async () => {
    setSaving(true);
    try {
      await pb.collection("leads").update(lead.id, {
        status: "Contacted",
      });

      await pb.collection("lead_activity").create({
        lead_id: lead.id,
        action: "Marked Contacted",
        actor: pb.authStore.model?.email ?? "unknown",
        meta: JSON.stringify({ status: "Contacted" }),
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
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
            <h2 className="text-xl font-semibold text-gray-800">
              {form.name}
            </h2>
            <div className="text-sm text-gray-500">{form.phone}</div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              form.status === "Contacted"
                ? "bg-blue-100 text-blue-700"
                : form.status === "Converted"
                ? "bg-green-100 text-green-700"
                : form.status === "Lost"
                ? "bg-red-100 text-red-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {form.status}
          </span>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-5">
            <Section title="Trip Details">
              <Input label="Travel Date" type="date" value={form.travel_date} onChange={(v: string)=>handleChange("travel_date",v)} />
              <Input label="Days" type="number" value={form.days} onChange={(v: string)=>handleChange("days",v)} />
              <Input label="Nights" type="number" value={form.nights} readOnly />
              <Input label="Location" value={form.location} onChange={(v: string)=>handleChange("location",v)} />
            </Section>

            <Section title="Passengers & Budget">
              <Input label="Adults" type="number" value={form.adults} onChange={(v: string)=>handleChange("adults",v)} />
              <Input label="Kids" type="number" value={form.kids} onChange={(v: string)=>handleChange("kids",v)} />
              <Input label="Budget" type="number" value={form.budget} onChange={(v: string)=>handleChange("budget",v)} />
            </Section>

            <Section title="Notes">
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={4}
                value={form.notes}
                onChange={(e)=>handleChange("notes",e.target.value)}
              />
            </Section>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <Section title="Status">
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={form.status}
                onChange={(e)=>handleChange("status",e.target.value)}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>

              <Input label="Next Follow-up" type="date" value={form.next_followup} onChange={(v: string)=>handleChange("next_followup",v)} />
            </Section>

            <Section title="Activity Timeline">
  {activity.length === 0 ? (
    <div className="py-6 text-center text-sm text-gray-400">
      No activity recorded yet
    </div>
  ) : (
    <div className="space-y-6">
      {activity.map((a) => {
        let meta: Record<string, string | number | boolean | object> = {};
        try {
          meta = a.meta ? JSON.parse(a.meta) : {};
        } catch {}

        return (
          <div
            key={a.id}
            className="w-full rounded-xl  p-4 "
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              {/* Dot */}
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />

              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">
                  {a.action}
                </div>

                <div className="mt-0.5 text-xs text-gray-400">
                  {new Date(a.created).toLocaleString()} • {a.actor}
                </div>
              </div>
            </div>

            {/* Meta */}
            {Object.keys(meta).length > 0 && (
              <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2">
                <div className="space-y-1.5 text-xs">
                  {Object.entries(meta).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-4 border-b last:border-0 pb-1 last:pb-0"
                    >
                      <span className="text-gray-500 capitalize">
                        {k.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium text-gray-800 text-right">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</Section>

          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white p-4 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg text-sm font-medium"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={markContacted}
              disabled={saving}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
            >
              Mark Contacted
            </button>

            <button
              onClick={() => {
                pb.collection("lead_activity").create({
                  lead_id: lead.id,
                  action: "Opened WhatsApp",
                  actor: pb.authStore.model?.email ?? "unknown",
                });

                window.open(
                  `https://wa.me/${(lead.phone || "").replace(/[^\d]/g, "")}`,
                  "_blank"
                );
              }}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-green-50"
            >
              WhatsApp
            </button>
          </div>

          <button onClick={onClose} className="text-gray-500 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4 shadow-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-3">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}

function Input({ label, value, onChange, type = "text", readOnly = false }: InputProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${readOnly ? "bg-gray-100 text-gray-500" : "bg-white"}`}
      />
    </div>
  );
}
