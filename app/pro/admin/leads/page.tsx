import PocketBase from "pocketbase";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  message?: string;
  created: string;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "new":      return "bg-blue-50 text-blue-700 border-blue-200";
    case "assigned": return "bg-amber-50 text-amber-700 border-amber-200";
    case "converted":return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "lost":     return "bg-red-50 text-red-700 border-red-200";
    default:         return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default async function LeadsPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASSWORD!
  );
  const leads = await pb.collection("leads").getFullList<Lead>({ sort: "-created" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">{leads.length} total records</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Source</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Message</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {(lead.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{lead.name || "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">{lead.phone}</td>
                <td className="px-4 py-3.5 text-slate-600 capitalize">{lead.source}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">{lead.message || "—"}</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">
                  {new Date(lead.created).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">No leads found</div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">
                  {(lead.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{lead.name || "—"}</p>
                  <p className="text-xs text-slate-500 font-mono">{lead.phone}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${statusStyle(lead.status)}`}>{lead.status}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
              <span className="capitalize">📍 {lead.source}</span>
              <span>{new Date(lead.created).toLocaleDateString()}</span>
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
