"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-8 md:px-40 ">
        {tripsData.map((trip) => (
          <div
            key={trip.id}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                <Clock size={14} /> {trip.duration}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-1 flex flex-col justify-between h-48">
              <div className="">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {trip.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                  <MapPin size={14} className="text-red-600" /> {trip.location}
                </p>
              </div>

              <div className="flex justify-between items-center ">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {trip.price}
                </span>
                <button className="bg-red-600  text-white text-xs sm:text-sm px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
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
