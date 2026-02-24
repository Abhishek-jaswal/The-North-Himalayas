"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import CreateSalespersonModal from "../components/CreateSalespersonModal";
import { UserPlus, TrendingUp, Users } from "lucide-react";

type Salesperson = {
  id: string; name: string; email: string; phone: string;
  is_active: boolean; total_assigned?: number; total_converted?: number;
};

export default function SalespersonsPage() {
  const [open, setOpen] = useState(false);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const sales = await pb.collection("salespersons").getFullList({ sort: "-created" });
    const leads = await pb.collection("leads").getFullList({ fields: "assigned_to,status" });
    const enriched = sales.map((sp) => {
      const assigned = leads.filter((l) => l.assigned_to === sp.id);
      const converted = assigned.filter((l) => l.status === "converted");
      return {
        id: sp.id, name: sp.name, email: sp.email, phone: sp.phone,
        is_active: sp.is_active,
        total_assigned: assigned.length,
        total_converted: converted.length,
      };
    });
    setSalespersons(enriched);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    pb.collection("salespersons").subscribe("*", loadData);
    pb.collection("leads").subscribe("*", loadData);
    return () => {
      pb.collection("salespersons").unsubscribe("*");
      pb.collection("leads").unsubscribe("*");
    };
  }, []);

  const maxAssigned = Math.max(...salespersons.map((s) => s.total_assigned ?? 0), 1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Salespersons</h1>
          <p className="text-sm text-slate-400 mt-0.5">{salespersons.length} team members</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-200"
        >
          <UserPlus size={15} />
          Add Salesperson
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: salespersons.length,                              color: "from-slate-600 to-slate-800", icon: Users },
          { label: "Active",   value: salespersons.filter((s) => s.is_active).length,  color: "from-emerald-400 to-teal-500",icon: TrendingUp },
          { label: "Inactive", value: salespersons.filter((s) => !s.is_active).length, color: "from-red-400 to-rose-500",    icon: Users },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{value}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Salesperson", "Email", "Phone", "Status", "Assigned", "Converted", "Performance"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={7} className="py-20 text-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : salespersons.map((user) => {
              const rate = user.total_assigned ? Math.round(((user.total_converted ?? 0) / user.total_assigned) * 100) : 0;
              const pct = Math.round(((user.total_assigned ?? 0) / maxAssigned) * 100);
              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 flex items-center justify-center text-sm font-black border border-amber-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{user.email}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 font-mono">{user.phone}</td>
                  <td className="px-5 py-4">
                    <select
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-all ${
                        user.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      }`}
                      value={user.is_active ? "active" : "inactive"}
                      onChange={async (e) => {
                        await pb.collection("salespersons").update(user.id, { is_active: e.target.value === "active" });
                      }}
                    >
                      <option value="active">● Active</option>
                      <option value="inactive">○ Inactive</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-base font-black text-slate-700">{user.total_assigned ?? 0}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-base font-black text-emerald-600">{user.total_converted ?? 0}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-20">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 w-8">{rate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && salespersons.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">No salespersons yet</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {salespersons.map((user) => {
          const rate = user.total_assigned ? Math.round(((user.total_converted ?? 0) / user.total_assigned) * 100) : 0;
          return (
            <div key={user.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 flex items-center justify-center font-black border border-amber-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <select
                  className={`text-[11px] font-bold px-2 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                    user.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"
                  }`}
                  value={user.is_active ? "active" : "inactive"}
                  onChange={async (e) => {
                    await pb.collection("salespersons").update(user.id, { is_active: e.target.value === "active" });
                  }}
                >
                  <option value="active">● Active</option>
                  <option value="inactive">○ Inactive</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 font-mono">{user.phone}</p>
              <div className="flex gap-4 pt-2 border-t border-slate-50">
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Assigned</p><p className="font-black text-slate-700">{user.total_assigned ?? 0}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Converted</p><p className="font-black text-emerald-600">{user.total_converted ?? 0}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase tracking-wide">Rate</p><p className="font-black text-amber-600">{rate}%</p></div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateSalespersonModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
