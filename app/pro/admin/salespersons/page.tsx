'use client';

import { useState } from "react";
import CreateSalespersonModal from "../components/CreateSalespersonModal";

export default function SalespersonsPage() {
  const [open, setOpen] = useState(false);

  // TEMP DATA (PocketBase will come later)
  const salespersons = [
    { id: 1, name: "Rohan Mehta", email: "rohan@example.com", phone: "9876543210", status: "Active" },
    { id: 2, name: "Simran Kaur", email: "simran@example.com", phone: "9123456780", status: "Active" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Salespersons</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add Salesperson
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {salespersons.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateSalespersonModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
