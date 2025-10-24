"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { tripsData } from "../data/tripsData";

export default function PlanYourTrip() {
  return (
    <section className="py-10 bg-white">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          <span className="text-red-600">Plan</span> Your Trip
        </h2>
        <div className="mx-auto mt-2 w-28 h-1 bg-gradient-to-r from-red-600 via-blue-600 to-blue-600 rounded-full" />
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {tripsData.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="relative w-full h-56">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                <Clock size={14} /> {trip.duration}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col justify-between h-48">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                  {trip.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                  <MapPin size={14} /> {trip.location}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold text-gray-900">{trip.price}</span>
                <button className="bg-red-600 text-white text-xs sm:text-sm px-4 py-2 rounded-md hover:bg-red-700 transition">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
