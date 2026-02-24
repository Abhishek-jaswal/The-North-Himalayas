import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number;
  icon?: LucideIcon;
  accent?: string;
  sub?: string;
};

export default function StatCard({ title, value, icon: Icon, accent = "bg-violet-500", sub }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 ${accent} bg-opacity-10 rounded-xl flex items-center justify-center`}>
            <Icon size={16} className={`${accent.replace("bg-", "text-")}`} />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-800 leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
    </div>
  );
}
