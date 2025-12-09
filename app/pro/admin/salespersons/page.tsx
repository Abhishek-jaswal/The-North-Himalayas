'use client';

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import CreateSalespersonModal from "../components/CreateSalespersonModal";

export default function SalespersonsPage() {
  const [open, setOpen] = useState(false);
  const [salespersons, setSalespersons] = useState([]);

  const loadSalespersons = async () => {
    const data = await pb.collection("salespersons").getFullList({
      sort: "-created",
    });
    setSalespersons(data);
  };

  useEffect(() => {
    loadSalespersons();

    // realtime updates
    pb.collection("salespersons").subscribe("*", () => {
      loadSalespersons();
    });

    return () => pb.collection("salespersons").unsubscribe("*");
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Salespersons</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Salesperson
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Active</th>
              <th className="py-3 px-4">Assigned</th>
              <th className="py-3 px-4">Converted</th>
            </tr>
          </thead>

         <tbody>
  {salespersons.map((user) => (
    <tr key={user.id} className="border-b">
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.phone}</td>

      {/* ACTIVE / INACTIVE DROPDOWN */}
      <td className="py-3 px-4">
        <select
          className="border px-2 py-1 rounded"
          value={user.is_active ? "active" : "inactive"}
          onChange={async (e) => {
            const newValue = e.target.value === "active";

            await pb.collection("salespersons").update(user.id, {
              is_active: newValue,
            });
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </td>

      <td className="py-3 px-4">{user.total_assigned}</td>
      <td className="py-3 px-4">{user.total_converted}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      <CreateSalespersonModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
