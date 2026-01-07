"use client";

interface SalesTopbarProps {
  name?: string;
}

export default function SalesTopbar({ name }: SalesTopbarProps) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between ml-0 md:ml-64 p-4">
      <h3 className="text-xl font-bold">
        Welcome{name ? `, ${name}` : ""}
      </h3>

      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm">Sales Dashboard</span>
      </div>
    </div>
  );
}
