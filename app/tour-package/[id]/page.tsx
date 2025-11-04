"use client";
import { useParams } from "next/navigation";
import { tripsData } from "@/app/data/tripsData";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Clock, MapPin, Tag } from "lucide-react";

export default function TourPackageDetails() {
  const { id } = useParams();
  const tour = tripsData.find((t) => t.id === id);

  const [openDay, setOpenDay] = useState<number | null>(null);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Tour not found.
      </div>
    );
  }

  // Split description into day sections
  const daySections = tour.description
    .split("**Day ")
    .filter((part) => part.includes(":"))
    .map((part) => {
      const [dayTitle, ...rest] = part.split("**");
      return {
        title: "Day " + dayTitle.replace(":", "").trim(),
        content: rest.join("").trim(),
      };
    });

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-black to-black text-gray-200">
      {/* Hero */}
      <div className="relative w-full h-72 sm:h-96">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-6 sm:left-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
            {tour.title}
          </h1>
          <p className="text-gray-300 mt-2">{tour.place}</p>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800/50 p-4 rounded-xl shadow-md">
            <Clock className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm uppercase text-gray-400">Duration</p>
            <p className="font-semibold">{tour.duration}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl shadow-md">
            <MapPin className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm uppercase text-gray-400">Destinations</p>
            <p className="font-semibold">{tour.destinations}</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl shadow-md">
            <Tag className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm uppercase text-gray-400">Price</p>
            <p className="font-semibold">{tour.price}</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-3 text-white">Overview</h2>
          <p className="text-gray-400 leading-relaxed">
            {tour.shortDesc}
          </p>
        </div>

        {/* Itinerary */}
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Day-wise Itinerary
          </h2>

          {daySections.map((day, index) => (
            <div
              key={index}
              className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenDay(openDay === index ? null : index)
                }
                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-lg text-white hover:bg-gray-800 transition-colors"
              >
                {day.title}
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openDay === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openDay === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-5 pb-5 text-gray-300 text-sm leading-relaxed"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: day.content.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
