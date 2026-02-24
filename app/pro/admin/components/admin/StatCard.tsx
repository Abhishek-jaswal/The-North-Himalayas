type Props = { title: string; value: number; };

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{title}</p>
      <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
    </div>
  );
}
