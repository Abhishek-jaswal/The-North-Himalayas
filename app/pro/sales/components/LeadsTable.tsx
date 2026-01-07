import { Lead } from "@/app/types/lead";

/* =======================
   PROPS
======================= */
interface LeadsTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
}

/* =======================
   COMPONENT
======================= */
export default function LeadsTable({
  leads,
  onView,
}: LeadsTableProps) {
  if (!leads.length) {
    return <p className="text-gray-500">No leads assigned</p>;
  }

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Phone</th>
          <th className="p-2 text-left">Message</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id} className="border-t hover:bg-gray-50">
            <td className="p-2">{lead.name}</td>
            <td className="p-2">{lead.phone}</td>
            <td className="p-2">{lead.notes ?? "-"}</td>
            <td className="p-2">
              <StatusBadge status={lead.status ?? "New"} />
            </td>
            <td className="p-2">
              <button
                onClick={() => onView(lead)}
                className="text-blue-600 hover:underline"
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* =======================
   STATUS BADGE
======================= */
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Converted"
      ? "bg-green-100 text-green-700"
      : status === "Lost"
      ? "bg-red-100 text-red-700"
      : status === "Contacted"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`px-2 py-1 rounded text-xs ${color}`}>
      {status}
    </span>
  );
}
