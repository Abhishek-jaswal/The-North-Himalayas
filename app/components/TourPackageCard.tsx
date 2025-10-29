"use client";
import Image from "next/image";
import { tripsData } from "../data/tripsData";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function TourPackageCard() {
  const router = useRouter();

  return (
    <section className="w-full bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      {/* Heading */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Popular Tour Packages
        </h2>
        <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
          Discover our curated travel packages that bring adventure, comfort, and unforgettable Himalayan experiences.
        </p>
        <div className="mx-auto mt-4 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
      </div>

      {/* Cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {tripsData.map((tour) => (
          <div
            key={tour.id}
            className="group relative bg-gray-950/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <Image
                src={tour.image}
                alt={`Beautiful view of ${tour.place} - ${tour.title}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={Number(tour.id) <= 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="absolute bottom-3 left-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">
                  {tour.place}
                </h3>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
              <div className="space-y-2 text-sm sm:text-base">
                <h4 className="font-semibold text-white text-lg group-hover:text-red-500 transition-colors">
                  {tour.title}
                </h4>
                <p className="text-gray-400">
                  <strong className="text-gray-300">Duration:</strong> {tour.duration}
                </p>
                <p className="text-gray-400">
                  <strong className="text-gray-300">Destination:</strong> {tour.destinations}
                </p>
                <p className="text-gray-400">
                  <strong className="text-gray-300">Activities:</strong> {tour.activities}
                </p>
                <p className="text-gray-400">
                  <strong className="text-gray-300">Theme:</strong> {tour.theme}
                </p>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-between mt-6 border-t border-gray-700 pt-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Starting from
                  </p>
                  <p className="text-xl font-bold text-white">{tour.price}</p>
                </div>

                <button
                  onClick={() => router.push(`/tour-package/${tour.id}`)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-4 py-2 rounded-full text-sm hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  aria-label={`Book ${tour.title}`}
                >
                  Book Now
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
