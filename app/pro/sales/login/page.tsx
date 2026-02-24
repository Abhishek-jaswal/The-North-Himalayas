"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const authData = await pb.collection("salespersons").authWithPassword(email, password);
      if (!authData.record.is_active) { setError("Your account is inactive. Contact admin."); pb.authStore.clear(); return; }
      router.push("/pro/sales/dashboard");
    } catch { setError("Invalid email or password"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#0c111d]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative overflow-hidden p-12">
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tight">Sales CRM</span>
            <span className="ml-2 text-[10px] text-indigo-400/70 uppercase tracking-[0.2em] font-semibold">Portal</span>
          </div>
        </div>
        <div className="relative z-10 mt-auto">
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Close more<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">deals faster.</span>
          </h1>
          <p className="text-slate-400 text-base mb-10">Track leads, schedule follow-ups, and hit your targets — all in one place.</p>
          <div className="space-y-3">
            {["Real-time lead updates","Smart follow-up reminders","WhatsApp & call integration","Mobile-first design"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
                <span className="text-slate-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
              <TrendingUp size={19} className="text-white" />
            </div>
            <span className="text-slate-800 font-black text-xl">Sales CRM</span>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">Sign in to your sales account</p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <span className="text-red-400 mt-0.5">⚠</span>{error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {[
              { label: "Email", icon: Mail,  type: showPw?"text":"email", ph: "you@company.com", val: email, set: setEmail, extra: null },
              { label: "Password", icon: Lock, type: showPw?"text":"password", ph: "••••••••", val: password, set: setPassword, extra: (
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                  {showPw ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
                </button>
              )},
            ].map(({ label, icon: Icon, type, ph, val, set, extra }) => (
              <div key={label}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon size={13} className="text-slate-500" />
                  </div>
                  <input type={label==="Password"?(showPw?"text":"password"):type} placeholder={ph} value={val}
                    onChange={(e) => set(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                  {extra}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-6">
            Admin?{" "}
            <a href="/pro/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">Admin Portal →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
