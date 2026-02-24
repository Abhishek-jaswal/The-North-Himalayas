"use client";

import { useState, FormEvent } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await pb.collection("admins").authWithPassword(email, password);
      router.push("/pro/admin");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0c111d]">
      {/* Left – Brand Panel */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative overflow-hidden p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/4 rounded-full blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tight">CRM Pro</span>
            <span className="ml-2 text-[10px] text-amber-400/70 uppercase tracking-[0.2em] font-semibold">Admin</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 mt-auto">
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Manage your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              entire team.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Full control over leads, salespersons, assignments, and real-time performance.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Assign & track leads in real time",
              "Monitor team performance",
              "Manage salesperson accounts",
              "Full activity history",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="text-slate-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Activity size={19} className="text-white" />
            </div>
            <span className="text-slate-800 font-black text-xl">CRM Pro</span>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">Sign in to your admin account to continue</p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <span className="text-red-400 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Mail size={13} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Lock size={13} className="text-slate-500" />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  {showPw ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            Sales team?{" "}
            <a href="/pro/sales/login" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Go to Sales Portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
