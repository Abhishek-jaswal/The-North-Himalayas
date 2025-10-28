"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { tripsData } from "../data/tripsData";

export default function PlanYourTrip() {
  const router = useRouter();

  const handleViewMore = (id: string) => {
    router.push(`/tour-package/${id}`); // navigate to TourPackage page
  };

  return (
    <section className="py-12 bg-black">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
         Plan Your Trip
        </h2>
        <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-md mx-auto">
          Discover curated travel experiences with the perfect blend of adventure and comfort.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 sm:px-8 md:px-12">
        {tripsData.map((trip) => (
          <div
            key={trip.id}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative cursor-pointer"
            onClick={() => handleViewMore(trip.id)}
          >
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden">
              {/* Scalable container */}
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500"></div>

                {/* View More Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewMore(trip.id);
                    }}
                    className="text-white text-base sm:text-lg font-semibold border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {trip.place}
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
     <div className="p-6 mt-10 item-center justify-center cursor-pointer">
      <button
        onClick={() => router.push("/Packages")}
        className="px-4 py-2 bg-gray-900-600 text-sm text-white border-b rounded-lg"
      >
       View All Packages →
      </button>
    </div>
    </section>
  );
}
