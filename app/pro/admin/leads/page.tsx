import PocketBase from "pocketbase";

export const dynamic = "force-dynamic"; // 👈 IMPORTANT

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  message?: string;
  created: string;
};

export default async function LeadsPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);

  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASSWORD!
  );

  const leads = await pb.collection("leads").getFullList<Lead>({
    sort: "-created",
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Leads</h1>
        <span className="text-sm text-gray-500">
          Total: {leads.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden md:table-cell">Message</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {lead.name || "—"}
                </td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3 capitalize">{lead.source}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : lead.status === "assigned"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell text-gray-600 max-w-xs truncate">
                  {lead.message || "-"}
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {new Date(lead.created).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No leads found
          </p>
        )}
      </div>
    </div>
  );
}
