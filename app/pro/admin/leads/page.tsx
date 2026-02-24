import PocketBase from "pocketbase";

export const dynamic = "force-dynamic";

type Lead = {
  id: string; name: string; phone: string;
  source: string; status: string; message?: string; created: string;
};

const statusStyle = (s: string) => {
  const m: Record<string, string> = {
    new:        "bg-blue-50 text-blue-600 border-blue-200",
    assigned:   "bg-amber-50 text-amber-600 border-amber-200",
    contacted:  "bg-purple-50 text-purple-600 border-purple-200",
    interested: "bg-indigo-50 text-indigo-600 border-indigo-200",
    converted:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    lost:       "bg-red-50 text-red-600 border-red-200",
  };
  return m[s?.toLowerCase()] ?? "bg-slate-50 text-slate-500 border-slate-200";
};

export default async function LeadsPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
  await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL!, process.env.PB_ADMIN_PASSWORD!);
  const leads = await pb.collection("leads").getFullList<Lead>({ sort: "-created" });

  const byStatus = leads.reduce((acc, l) => {
    const s = l.status?.toLowerCase() || "new";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">All Leads</h1>
          <p className="text-sm text-slate-400 mt-0.5">{leads.length} total records in system</p>
        </div>
        {/* Status summary pills */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
          {Object.entries(byStatus).slice(0, 4).map(([s, count]) => (
            <span key={s} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border capitalize ${statusStyle(s)}`}>
              {s}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Lead", "Phone", "Source", "Status", "Message", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/80">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-amber-50/20 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-black text-slate-600 border border-slate-200 shrink-0">
                      {(lead.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{lead.name || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{lead.phone}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500 capitalize">{lead.source || "—"}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize ${statusStyle(lead.status)}`}>
                    {lead.status || "new"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-400 max-w-[200px] truncate">{lead.message || "—"}</td>
                <td className="px-5 py-3.5 text-xs text-slate-400">
                  {new Date(lead.created).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">No leads found</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-600 text-sm border border-slate-200">
                  {(lead.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{lead.name || "—"}</p>
                  <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${statusStyle(lead.status)}`}>
                {lead.status || "new"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
              <span className="capitalize font-medium">📍 {lead.source || "—"}</span>
              <span>{new Date(lead.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">No leads found</div>
        )}
      </div>
    </div>
  );
}
