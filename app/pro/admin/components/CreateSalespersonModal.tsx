"use client";

import { useState } from "react";
import { pb } from "@/app/lib/pocketbase";
import { X, User, Mail, Phone, Lock, UserPlus } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

export default function CreateSalespersonModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await pb.collection("salespersons").create({
        email, password, passwordConfirm: password,
        name, phone,
        territory: "N/A", is_active: false, ast_active: "N/A",
        total_assigned: 0, total_converted: 0,
      });
      setName(""); setEmail(""); setPhone(""); setPassword("");
      onClose();
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const fields = [
    { label: "Full Name",    icon: User,  value: name,     set: setName,     type: "text",     ph: "John Doe" },
    { label: "Email",        icon: Mail,  value: email,    set: setEmail,    type: "email",    ph: "john@company.com" },
    { label: "Phone Number", icon: Phone, value: phone,    set: setPhone,    type: "tel",      ph: "+91 98765 43210" },
    { label: "Password",     icon: Lock,  value: password, set: setPassword, type: "password", ph: "Min. 8 characters" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <UserPlus size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Add Salesperson</h2>
                <p className="text-orange-100 text-[11px]">New team member account</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
              <X size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {fields.map(({ label, icon: Icon, value, set, type, ph }) => (
            <div key={label}>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5">{label}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Icon size={13} className="text-slate-500" />
                </div>
                <input
                  type={type}
                  placeholder={ph}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition bg-slate-50"
                />
              </div>
            </div>
          ))}

          <p className="text-[10px] text-slate-400 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            ⚠️ Account will be <strong>inactive</strong> by default. Activate from Salespersons page.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name || !email || !password}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
