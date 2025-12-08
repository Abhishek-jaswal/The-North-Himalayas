export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-gray-500">Total Leads</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-gray-500">Assigned Leads</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-gray-500">New Today</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-gray-500">Follow-ups Today</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Salesperson Performance</h3>

        <p className="text-gray-500">No data yet.</p>
      </div>
    </div>
  );
}
