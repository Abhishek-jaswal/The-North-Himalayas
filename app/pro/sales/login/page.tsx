'use client';

import { useState, FormEvent } from "react";
import { pb } from "@/app/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const auth = await pb.collection("users").authWithPassword(email, password);

      // CHECK ROLE = SALESPERSON ONLY
      if (auth.record.role !== "salesperson") {
        setError("You are not allowed to access salesperson panel.");
        pb.authStore.clear();
        return;
      }

      router.push("pro/sales/dashboard"); // REDIRECT TO SALESPERSON DASHBOARD
    } catch (err: any) {
      setError("Invalid email or password");
      console.log(err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Salesperson Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
