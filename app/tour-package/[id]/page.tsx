"use client";
import { useParams, useRouter } from "next/navigation";
import { tripsData } from "@/app/data/tripsData";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Clock, MapPin, Tag, ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import WeatherBox from "@/app/components/WeatherBox";

export default function TourPackageDetails() {
  const router = useRouter();
  const { id } = useParams();
  const tour = tripsData.find((t) => t.id === id);
  const [openDay, setOpenDay] = useState<number | null>(null);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Tour not found.
      </div>
    );
  }

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
    <>
      <Navbar />
      <section className="min-h-screen bg-black text-gray-200 ">
        {/* Hero Section */}
       <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="relative w-full h-[400px] sm:h-[550px] md:h-[650px] overflow-hidden"
>
   {/* Weather */}
  <WeatherBox place={tour.place} />
  {/* Full background image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${tour.image})`,
    }}
  />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

  {/* Text */}
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="absolute bottom-12 left-6 sm:left-12 right-6 sm:right-12"
  >
    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-3 drop-shadow-lg">
      {tour.title}
    </h1>
    <p className="text-gray-300 text-lg">{tour.place}</p>
  </motion.div>
</motion.div>


        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {/* Overview Cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Clock className="mx-auto mb-3 text-white" size={32} />
              <p className="text-sm uppercase text-gray-400 tracking-wider text-center mb-1">
                Duration
              </p>
              <p className="font-semibold text-white text-center text-lg">
                {tour.duration}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <MapPin className="mx-auto mb-3 text-white" size={32} />
              <p className="text-sm uppercase text-gray-400 tracking-wider text-center mb-1">
                Destinations
              </p>
              <p className="font-semibold text-white text-center text-lg">
                {tour.destinations}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Tag className="mx-auto mb-3 text-white" size={32} />
              <p className="text-sm uppercase text-gray-400 tracking-wider text-center mb-1">
                Price
              </p>
              <p className="font-semibold text-white text-center text-lg">
                {tour.price}
              </p>
            </div>
          </motion.div>

          {/* Overview Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {tour.shortDesc}
            </p>
          </motion.div>

          {/* Itinerary Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Day-wise Itinerary
            </h2>

            {daySections.map((day, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenDay(openDay === index ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-lg text-white hover:bg-white/5 transition-all duration-300"
                >
                  {day.title}
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openDay === index ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                <AnimatePresence>
                  {openDay === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: day.content.replace(/\n/g, "<br/>"),
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Back Button */}
            <motion.button
              onClick={() => router.push("/Packages")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 flex items-center justify-center gap-2 px-8 py-3 bg-white/5 border border-white/20 rounded-full text-white font-semibold text-base hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <ArrowLeft size={20} />
              Back to Packages
            </motion.button>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-16 mx-auto w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
