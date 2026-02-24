interface StatCardProps {
  title: string;
  value: number;
  percent?: number;
  icon: React.ReactNode;
  color?: string;
  textColor?: string;
}

export default function StatCard({
  title,
  value,
  percent,
  icon,
  color = "bg-white",
  textColor = "text-slate-800",
}: StatCardProps) {
  return (
    <div className={`${color} rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wide ${textColor === "text-slate-800" ? "text-slate-500" : "text-current opacity-70"}`}>
          {title}
        </p>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className={`text-3xl font-black ${textColor} leading-none`}>{value}</p>
      {percent !== undefined && (
        <p className={`text-xs mt-2 font-medium ${percent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {percent >= 0 ? "▲" : "▼"} {Math.abs(percent)}% vs last month
        </p>
      )}
    </div>
  );
}
