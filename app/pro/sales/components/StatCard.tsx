interface StatCardProps {
  title: string;
  value: number;
  percent?: number;
  icon: React.ReactNode;
  gradient?: string;
}

export default function StatCard({ title, value, percent, icon, gradient = "from-indigo-500 to-violet-500" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 cursor-pointer overflow-hidden relative">
      {/* Background accent */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${gradient} opacity-[0.06] rounded-full`} />
      <div className="flex items-start justify-between mb-3 relative">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{title}</p>
        <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-sm text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-slate-800 leading-none relative">{value}</p>
      {percent !== undefined && (
        <p className={`text-[11px] mt-2 font-bold relative ${percent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {percent >= 0 ? "▲" : "▼"} {Math.abs(percent)}% vs last month
        </p>
      )}
    </div>
  );
}
