"use client";

import { useEffect, useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import CreateSalespersonModal from "../components/CreateSalespersonModal";

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
    // fetch salespersons
    const sales = await pb.collection("salespersons").getFullList({
      sort: "-created",
    });

    // fetch leads
    const leads = await pb.collection("leads").getFullList({
      fields: "assigned_to,status",
    });

    // calculate stats
    const enrichedSales = sales.map((sp) => {
      const assignedLeads = leads.filter(
        (lead) => lead.assigned_to === sp.id
      );

      const convertedLeads = assignedLeads.filter(
        (lead) => lead.status === "converted"
      );

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
    (async () => {
      await loadData();
    })();

    // realtime updates
    pb.collection("salespersons").subscribe("*", loadData);
    pb.collection("leads").subscribe("*", loadData);

    return () => {
      pb.collection("salespersons").unsubscribe("*");
      pb.collection("leads").unsubscribe("*");
    };
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

                {/* ACTIVE / INACTIVE */}
                <td className="py-3 px-4">
                  <select
                    className="border px-2 py-1 rounded"
                    value={user.is_active ? "active" : "inactive"}
                    onChange={async (e) => {
                      await pb
                        .collection("salespersons")
                        .update(user.id, {
                          is_active: e.target.value === "active",
                        });
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>

                <td className="py-3 px-4 font-medium">
                  {user.total_assigned ?? 0}
                </td>

                <td className="py-3 px-4 font-medium text-green-600">
                  {user.total_converted ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateSalespersonModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
