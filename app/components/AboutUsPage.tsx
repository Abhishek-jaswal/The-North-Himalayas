"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <section className="w-full bg-black text-white py-16 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* --- Hero Image --- */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] overflow-hidden rounded-2xl shadow-2xl mb-10"
        >
          <Image
            src="/images/logos/logo_5.jpg" // 🖼️ Replace with your actual image path
            alt="The North Himalayas - About Us"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        
        </motion.div> */}

        {/* --- Content Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left space-y-6 md:space-y-8 max-w-4xl"
        >
          <div >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight text-center md:text-left">
              About Us
            </h1>
            <div className="mx-auto md:mx-0 mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
          </div>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-white">The North Himalayas</span>,
            your trusted travel companion for unforgettable journeys across the breathtaking landscapes of India.
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            We are a passionate team of travel professionals dedicated to crafting seamless, customized,
            and memorable travel experiences for every explorer — from honeymoon couples and families
            to adventure seekers and corporate groups.
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Based in the heart of the Himalayas, we specialize in tours that blend comfort,
            culture, and natural beauty. With deep local knowledge, reliable partners, and a commitment
            to excellence, we ensure that every journey is safe, enjoyable, and truly unforgettable.
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Founded by MBA (Travel & Tourism) professionals, our journey began with a dream —
            to share the calm and inspiration found in the mountains. What started as passion is now
            a trusted travel brand known for personalized service and authentic experiences.
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            From the valleys of Himachal and Kashmir to Rajasthan and Kerala, we curate Pan India tours
            that blend comfort, authenticity, and exploration — yet our heart always remains in the Himalayas.
          </p>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            At <span className="font-semibold text-white">The North Himalayas</span>, we aim to build more than trips —
            we’re creating a <span className="italic">North Himalayan Family</span>, a community of travelers
            reconnecting with nature’s peace and simplicity.
          </p>
        </motion.div>

        {/* --- Decorative Line --- */}
        <div className="mt-16 mx-auto w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-60" />
      </div>
    </section>
  );
}
