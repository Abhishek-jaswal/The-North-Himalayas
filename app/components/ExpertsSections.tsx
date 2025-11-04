"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Expert {
  name: string;
  title?: string;
  img: string;
  desc: string;
  alt: string;
}

const experts: Expert[] = [
    {
    name: "Suraj Jaryal",
    title: "Founder & Travel Visionary",
    img: "/experts/surajj.jpg",
    desc: "A passionate explorer with a deep love for the mountains, Suraj turned his travel dreams into reality by creating The North Himalayas. His vision is simple — to help others find peace and purpose through travel.",
    alt: "Suraj Jaryal beside a vehicle in mountains",
  },

  {
    name: "Abhishek Kumar",
    title: "Operations & Experience Curator",
    img: "/experts/abhishek.jpg",
    desc: "Abhishek ensures every itinerary runs smoothly — from seamless logistics to unforgettable experiences. His attention to detail makes every trip effortless and enjoyable.",
    alt: "Abhishek Kumar smiling outdoors",
  },

  {
    name: "Ankaj Thakur",
    title: "Sales & Client Relations Expert",
    img: "/experts/ankaj.jpg",
    desc: "The friendly face of The North Himalayas, Ankaj believes every traveler deserves a personalized experience. His warmth and professionalism ensure guests feel like family.",
    alt: "Ankaj Thakur smiling near a lake",
  },
    {
    name: "Sourabh Kumar",
    title: "Destination & Adventure Specialist",
    img: "/experts/sourabh.jpg",
    desc: "From hidden Himalayan trails to iconic Indian landmarks, Sourabh knows them all. His expertise in adventure and offbeat travel makes every journey exciting and safe.",
    alt: "Sourabh smiling outdoors",
  },
];

export default function ExpertsSection() {
  return (
    <section
      aria-labelledby="experts-heading"
      className="relative bg-black text-white px-4 sm:px-8 lg:px-20 overflow-hidden"
    >
      {/* --- Decorative Glow Background --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-blackto-gray-900 opacity-90" />
     
      {/* --- Section Header --- */}
      <div className="relative z-10 text-center mb-16">
        <h2
          id="experts-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
        >
          Meet Our Experts
        </h2>
        <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
        <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Our expert team ensures that every journey is crafted with perfection, passion, and a personal touch.
        </p>
      </div>

      {/* --- Experts Grid --- */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {experts.map((expert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group bg-gradient-to-b from-gray-900/80 via-black/80 to-black border border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-gray-600/20 transition-all duration-500 p-6 flex flex-col items-center text-center"
          >
            {/* Expert Image */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-5">
              <Image
                src={expert.img}
                alt={expert.alt}
                fill
                className="rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-400 transition-all duration-500"
                priority={index === 0}
              />
            </div>

            {/* Expert Info */}
            <h3 className="text-lg font-semibold mb-1">
              {expert.name}
            </h3>
            {expert.title && (
              <p className="text-gray-400 text-xs text-green-500  mb-3">{expert.title}</p>
            )}
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 group-hover:text-gray-200 transition-colors duration-300">
              {expert.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* --- Decorative Line --- */}
      <div className="my-12 mx-auto w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-50" />
    </section>
  );
}
