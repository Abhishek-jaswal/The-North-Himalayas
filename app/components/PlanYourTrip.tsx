"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { tripsData } from "../data/tripsData";

export default function PlanYourTrip() {
  return (
    <section className="py-16 ">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-200 tracking-tight">
          <span className="text-gray-200">Plan</span> Your Trip
        </h2>
        <div className="mx-auto mt-3 w-28  bg-gradient-to-r from-red-600 via-blue-600 to-blue-600 rounded-full" />
        <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-md mx-auto">
          Discover curated travel experiences with the perfect blend of adventure and comfort.
        </p>
      </div>

      {/* Cards Grid */}
     <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 px-6 sm:px-8 md:px-40">
  {tripsData.map((trip) => (
    <div
      key={trip.id}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
    >
      {/* Image Section */}
      <div className="relative w-full h-56 overflow-hidden">
        {/* Wrap both image + overlay in a scalable container */}
        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500"></div>

          {/* View More Button (fades + scales in) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
            <button className="text-white text-lg font-semibold  px-5 py-2   hover:text-black transition-all duration-300">
              View More
            </button>
          </div>
        </div>

        {/* Duration Label */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
          <Clock size={14} /> {trip.duration}
        </div>
      </div>
    </div>
  ))}
</div>

    </section>
  );
}
