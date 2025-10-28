"use client";
import Image from "next/image";
import { tripsData } from "../data/tripsData";


export default function TourPackageCard() {
 

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-4 space-y-6">
      {tripsData.map((tour) => (
        <div
          key={tour.id}
          className="flex flex-col sm:flex-row bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-500 group"
        >
          {/* Image */}
          <div className="sm:w-1/3 relative overflow-hidden">
            <Image
              src={tour.image}
              alt={`Beautiful view of ${tour.place} - ${tour.title}`}
              width={400}
              height={300}
              className="w-full h-48 sm:h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="sm:w-2/3 flex flex-col justify-between p-4 sm:p-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {tour.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-800">Duration:</strong> {tour.duration}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-800">Destination Covered:</strong>{" "}
                {tour.destinations}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-800">Tour Activities:</strong> {tour.activities}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">Tour Themes:</strong> {tour.theme}
              </p>
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-4 border-t pt-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                <p className="text-gray-900 font-bold">{tour.price}</p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md">
                Book Your Tour
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
