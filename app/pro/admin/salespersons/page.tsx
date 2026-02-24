"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import CreateSalespersonModal from "../components/CreateSalespersonModal";
import { UserPlus } from "lucide-react";

type Salesperson = {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  total_assigned?: number;
  total_converted?: number;
};

export default function SalespersonsPage() {
  const [open, setOpen] = useState(false);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);

  const loadData = async () => {
    const sales = await pb.collection("salespersons").getFullList({ sort: "-created" });
    const leads = await pb.collection("leads").getFullList({ fields: "assigned_to,status" });

    const enrichedSales = sales.map((sp) => {
      const assignedLeads = leads.filter((lead) => lead.assigned_to === sp.id);
      const convertedLeads = assignedLeads.filter((lead) => lead.status === "converted");
      return {
        id: sp.id,
        name: sp.name,
        email: sp.email,
        phone: sp.phone,
        is_active: sp.is_active,
        total_assigned: assignedLeads.length,
        total_converted: convertedLeads.length,
      };
    });

    setSalespersons(enrichedSales);
  };

  useEffect(() => {
    (async () => { await loadData(); })();
    pb.collection("salespersons").subscribe("*", loadData);
    pb.collection("leads").subscribe("*", loadData);
    return () => {
      pb.collection("salespersons").unsubscribe("*");
      pb.collection("leads").unsubscribe("*");
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Salespersons</h1>
          <p className="text-sm text-slate-500 mt-0.5">{salespersons.length} team members</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-violet-200"
        >
          <UserPlus size={15} />
          Add Salesperson
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["Name", "Email", "Phone", "Status", "Assigned", "Converted"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {salespersons.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{user.email}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{user.phone}</td>
                <td className="px-5 py-3.5">
                  <select
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                      user.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                    value={user.is_active ? "active" : "inactive"}
                    onChange={async (e) => {
                      await pb.collection("salespersons").update(user.id, {
                        is_active: e.target.value === "active",
                      });
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                    {user.total_assigned ?? 0}
                    <span className="text-xs text-slate-400 font-normal">leads</span>
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                    {user.total_converted ?? 0}
                    <span className="text-xs text-emerald-400 font-normal">done</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {salespersons.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">No salespersons yet</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {salespersons.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <select
                className={`text-xs font-semibold px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                  user.is_active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
                value={user.is_active ? "active" : "inactive"}
                onChange={async (e) => {
                  await pb.collection("salespersons").update(user.id, {
                    is_active: e.target.value === "active",
                  });
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 font-mono">{user.phone}</p>
            <div className="flex gap-4 pt-2 border-t border-slate-50 text-sm">
              <div>
                <p className="text-xs text-slate-400">Assigned</p>
                <p className="font-bold text-slate-700">{user.total_assigned ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Converted</p>
                <p className="font-bold text-emerald-600">{user.total_converted ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Rate</p>
                <p className="font-bold text-indigo-600">
                  {user.total_assigned
                    ? Math.round(((user.total_converted ?? 0) / user.total_assigned) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateSalespersonModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
