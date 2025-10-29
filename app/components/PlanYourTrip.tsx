"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { tripsData } from "../data/tripsData";

export default function PlanYourTrip() {
  const router = useRouter();

  const handleViewMore = (id: string) => {
    router.push(`/tour-package/${id}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      {/* Title */}
      <div className="text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-gray-100 tracking-wide">
          Plan Your Trip
          
        </h2>
        <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
        <p className="text-gray-400 text-sm sm:text-base mt-4 max-w-lg mx-auto">
          Discover curated travel experiences with the perfect blend of adventure, comfort, and luxury.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 sm:px-10 md:px-14 mt-14">
        {tripsData.slice(0, 4).map((trip) => (
          <div
            key={trip.id}
            onClick={() => handleViewMore(trip.id)}
            className="group relative bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={Number(trip.id) <= 4}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-700 group-hover:from-black/90 group-hover:via-black/60" />

              {/* Duration Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <Clock size={14} /> {trip.duration}
              </div>

              {/* Hover Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMore(trip.id);
                  }}
                  className="px-5 py-2 text-white border border-white/70 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300"
                >
                  Explore Now →
                </button>
              </div>
            </div>

            {/* Trip Details */}
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-white group-hover:text-gray-400 transition-colors duration-300">
                {trip.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{trip.place}</p>
              <p className="text-xs text-gray-500 mt-2 italic">
                {trip.destinations}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => router.push("/Packages")}
          className="px-8 py-2.5 bg-gradient-to-r text-sm from-gray-600 to-black text-white font-semibold rounded-full  hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
        >
          View All Packages →
        </button>
      </div>
    </section>
  );
}
