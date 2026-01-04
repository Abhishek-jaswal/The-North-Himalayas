'use client';

import { useState } from "react";
import { pb } from "@/app/lib/pocketbase";

interface CreateSalespersonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSalespersonModal({ open, onClose }: CreateSalespersonModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    try {
      await pb.collection("salespersons").create({
        email,
        password,
        passwordConfirm: password,    // ✅ REQUIRED for AUTH COLLECTIONS

        name,
        phone,
        territory: "N/A",
        is_active: false,
        ast_active: "N/A",
        total_assigned: 0,
        total_converted: 0,
      });

      // Reset after create
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

      onClose();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + errorMessage);
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Salesperson</h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
