"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <section className=" w-full bg-black text-white flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-5xl w-full text-center md:text-left space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight text-center ">
                         <Image src="/images/logos/logo_5.jpg" alt="Logo" width={60} height={40} />

          About Us — 
        </h1>
        <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Welcome to <span className="font-semibold text-white">The North Himalayas</span>,
          your trusted travel companion for unforgettable journeys across the breathtaking landscapes of India.
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          We are a passionate team of travel professionals dedicated to crafting seamless, customized,
          and memorable travel experiences for every kind of explorer — from honeymoon couples and
          family vacationers to adventure seekers and corporate groups.
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Based in the heart of the Himalayas, we specialize in organizing tours that blend comfort,
          culture, and natural beauty. Our deep local knowledge, reliable network of hotels and transport
          partners, and commitment to excellence ensure that every trip we plan is safe, enjoyable,
          and truly unforgettable.
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Founded by a team of MBA (Travel & Tourism) professionals, our journey began with a simple dream —
          to escape the chaos of daily life and share the calm we found in the mountains. What started as a
          passion project has now grown into a trusted travel brand known for its personalized service,
          local expertise, and unforgettable experiences.
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          From the serene valleys of Himachal and Kashmir to the vibrant cultures of Rajasthan and the
          backwaters of Kerala, we curate Pan India tours that blend comfort, authenticity, and exploration.
          Yet, our heart remains in the Himalayas — our home, our inspiration, and our signature.
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          At <span className="font-semibold text-white">The North Himalayas</span>, we aim to build more than just trips —
          we’re building a <span className="italic">North Himalayan Family</span>, a community of travelers who come together
          to find peace amidst the world’s chaos and reconnect with nature’s simplicity.
        </p>
      </motion.div>
    </section>
  );
}
