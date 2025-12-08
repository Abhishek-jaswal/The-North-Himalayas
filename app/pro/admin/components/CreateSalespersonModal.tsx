'use client';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateSalespersonModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Salesperson</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
