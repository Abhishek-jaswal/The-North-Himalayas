'use client';

import { useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { X, User, Mail, Phone, Lock } from "lucide-react";

interface CreateSalespersonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSalespersonModal({ open, onClose }: CreateSalespersonModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await pb.collection("salespersons").create({
        email,
        password,
        passwordConfirm: password,
        name,
        phone,
        territory: "N/A",
        is_active: false,
        ast_active: "N/A",
        total_assigned: 0,
        total_converted: 0,
      });

      setName(""); setEmail(""); setPhone(""); setPassword("");
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Add Salesperson</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Full Name", icon: User,  value: name,     set: setName,     type: "text",     ph: "John Doe" },
            { label: "Email",     icon: Mail,  value: email,    set: setEmail,    type: "email",    ph: "john@example.com" },
            { label: "Phone",     icon: Phone, value: phone,    set: setPhone,    type: "tel",      ph: "+91 98765 43210" },
            { label: "Password",  icon: Lock,  value: password, set: setPassword, type: "password", ph: "••••••••" },
          ].map(({ label, icon: Icon, value, set, type, ph }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={type}
                  placeholder={ph}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
