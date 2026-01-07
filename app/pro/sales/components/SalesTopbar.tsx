"use client";

export default function SalesTopbar({ name }: any) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <h3 className="text-xl font-bold">Welcome, {name}</h3>

      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm">Sales Dashboard</span>
      </div>
    </div>
  );
}
