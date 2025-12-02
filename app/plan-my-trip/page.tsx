"use client";

import { useState, FormEvent } from "react";

export default function PlanMyTripPage() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const response = await fetch("/api/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, budget, month }),
    });

    const data = await response.json();
    setResult(data.itinerary);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 text-gray-400">
      <h1 className="text-3xl font-bold mb-4 text-center">
        AI Trip Planner
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Month of Travel"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-5 border rounded bg-gray-50 whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-3">Your Itinerary</h2>
          {result}
        </div>
      )}
    </div>
  );
}
