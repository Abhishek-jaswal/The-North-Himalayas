"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import FullScreenCarousel from "./FullScreenCarousel";
import ContactForm from "./ContactForm";
import PlanYourTrip from "./PlanYourTrip";
import ImageMarquee from "./ImageMarquee";
import WhatsAppButton from "./WhatsAppButton";
import Footer from "./Footer";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short load time
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-3xl font-bold">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-wide text-center"
            >
              THE NORTH HIMALAYAS
            </motion.h1>

            <motion.div
              className="mt-6 w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
              transition={{ repeat: Infinity, duration: 1 }}
            ></motion.div>

            <p className="mt-4 text-lg tracking-widest opacity-70">
              Exploring the Mountains...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="k"
          >
            <Navbar />
            <FullScreenCarousel />
            <ContactForm />
            <PlanYourTrip />
            <ImageMarquee />
            <WhatsAppButton />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
