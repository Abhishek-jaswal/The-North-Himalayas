'use client';

export default function Topbar() {
  return (
    <div className="w-full bg-white shadow flex items-center justify-between px-6 py-4">
      <h2 className="text-xl font-semibold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        {/* Notifications icon */}
        <div className="cursor-pointer">
          🔔
        </div>

        {/* Admin Profile */}
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
