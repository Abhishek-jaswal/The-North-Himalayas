interface StatCardProps {
  title: string;
  value: number;
  percent?: number;
  icon: React.ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  percent,
  icon,
  color = "bg-gray-100",
}: StatCardProps) {
  return (
    <div className={`rounded-xl p-5 shadow-sm hover:shadow-md transition ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>

          {percent !== undefined && (
            <p
              className={`text-xs mt-1 ${
                percent >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percent >= 0 ? "+" : ""}
              {percent}% vs last month
            </p>
          )}
        </div>

        <div className="p-2 rounded-lg  shadow">
          {icon}
        </div>
      </div>
    </div>
  );
}
