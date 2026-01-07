type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
};

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white mt-2 rounded-xl p-5 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          {trend && <p className="text-green-600 text-xs mt-1">{trend}</p>}
        </div>
        <div className="text-3xl text-blue-600">{icon}</div>
      </div>
    </div>
  );
}
