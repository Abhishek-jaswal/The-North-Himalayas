"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/app/lib/pocketbase";

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const authData = await pb
        .collection("salespersons")
        .authWithPassword(email, password);

      const salesperson = authData.record;

      // FIXED: check correct field
      if (!salesperson.is_active) {
        setError("Your account is inactive. Contact admin.");
        pb.authStore.clear();
        return;
      }

      router.push("/pro/sales/dashboard");

    } catch (err: any) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Salesperson Login</h2>

        {error && (
          <p className="bg-red-200 text-red-800 p-2 mb-3 rounded">{error}</p>
        )}

        <input
          type="text"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
