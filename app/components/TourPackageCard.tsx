"use client";
import Image from "next/image";
import { tripsData } from "../data/tripsData";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function TourPackageCard() {
  const router = useRouter();

  return (
    <section className="w-full bg-gradient-to-b mt-10 from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Popular Tour Packages
        </h2>
        <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
          Discover our handpicked travel packages crafted to bring you adventure, comfort, and unforgettable experiences.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tripsData.map((tour) => (
          <div
            key={tour.id}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <Image
                src={tour.image}
                alt={`Beautiful view of ${tour.place} - ${tour.title}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={Number(tour.id) <= 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>

              <div className="absolute bottom-3 left-3">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-lg">
                  {tour.place}
                </h3>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
              <div className="space-y-2 text-sm sm:text-base">
                <h4 className="font-semibold text-gray-800 text-lg group-hover:text-red-600 transition-colors">
                  {tour.title}
                </h4>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Duration:</strong> {tour.duration}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Destination:</strong> {tour.destinations}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Activities:</strong> {tour.activities}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Theme:</strong> {tour.theme}
                </p>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-between mt-6 border-t pt-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Starting from</p>
                  <p className="text-xl font-bold text-gray-900">{tour.price}</p>
                </div>

                <button
                  onClick={() => router.push(`/tour-package/${tour.id}`)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-4 py-2 rounded-full text-sm hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  aria-label={`Book ${tour.title}`}
                >
                  Book Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
