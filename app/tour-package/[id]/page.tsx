"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { tripsData } from "../../data/tripsData";

export default function TourPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params); // ✅ unwrap Promise
  const trip = tripsData.find((t) => t.id === resolvedParams.id);
  const router = useRouter();

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Tour not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 md:px-10">
      <div className="w-full max-w-5xl bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden relative animate-fadeIn">
        
        {/* ✅ Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-full z-10 text-sm font-medium shadow-md transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Image Section */}
        <div className="relative w-full h-80 sm:h-96">
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{trip.title}</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {trip.description}
          </p>

          <ul className="space-y-2 text-gray-600">
            <li><strong>Duration:</strong> {trip.duration}</li>
            <li><strong>Destination Covered:</strong> {trip.destinations}</li>
            <li><strong>Activities:</strong> {trip.activities}</li>
            <li><strong>Theme:</strong> {trip.theme}</li>
          </ul>

          <div className="mt-8 flex justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
              Book Your Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
