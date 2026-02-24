'use client';

import { useState, FormEvent } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await pb.collection("admins").authWithPassword(email, password);
      router.push("/pro/admin");
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/10" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">CRM Pro</h1>
          <p className="text-slate-400 text-lg">Admin Control Panel</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {["Manage Leads", "Track Sales", "Monitor Team", "Real-time Data"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your admin account</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all shadow-sm shadow-violet-200 disabled:opacity-70 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
