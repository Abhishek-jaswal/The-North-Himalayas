"use client";

import Image from "next/image";

interface Expert {
  name: string;
  title?: string;
  img: string;
  desc: string;
  alt: string;
}

const experts: Expert[] = [
  {
    name: "Sourabh Kumar",
    title: "Destination & Adventure Specialist",
    img: "/experts/sourabh.jpg",
    desc: "From hidden Himalayan trails to iconic Indian landmarks, Sourabh knows them all. His expertise in adventure and offbeat travel makes every journey exciting and safe.",
    alt: "Sourabh smiling outdoors",
  },
  {
    name: "Abhishek Kumar",
    title: "Operations & Experience Curator",
    img: "/experts/abhishek.jpg",
    desc: "Abhishek ensures every itinerary runs smoothly — from seamless logistics to unforgettable experiences. His attention to detail makes every trip effortless and enjoyable.",
    alt: "Abhishek Kumar smiling outdoors",
  },
  {
    name: "Suraj Jaryal",
    title: "Founder & Travel Visionary",
    img: "/experts/surajj.jpg",
    desc: " A passionate explorer with a deep love for the mountains, Suraj turned his travel dreams into reality by creating The North Himalayas. His vision is simple — to help others find peace and purpose through travel.",
    alt: "Suraj Jaryal beside a vehicle in mountains",
  },
  {
    name: "Ankaj Thakur",
    title: "Sales & Client Relations Expert",
    img: "/experts/ankaj.jpg",
    desc: "The friendly face of The North Himalayas, Ankaj believes every traveler deserves a personalized experience. His warmth and professionalism ensure guests feel like family.",
    alt: "Ankaj Thakur smiling near a lake",
  },
];

export default function ExpertsSection() {
  return (
    <section
      aria-labelledby="experts-heading"
      className="relative bg-black text-white py-16 px-4 sm:px-8 lg:px-20 overflow-hidden"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0  bg-center opacity-20"
        role="presentation"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto z-10">
        <header className="text-center mb-12">
         
          <h2
            id="experts-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Meet Our Experts
          </h2>
                  <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
                  <h4 className="mt-4 text-gray-400 text-sm sm:text-base max-w-md mx-auto">A Our expert team ensures that every journey is planned with perfection, passion, and a personal touch.</h4>

        </header>

        {/* Grid Layout */}
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
            divide-y sm:divide-y-0 sm:divide-x divide-gray-600/50
          "
          role="list"
          aria-label="Expert profiles"
        >
          {experts.map((expert, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-6 py-10"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 relative mb-4">
                <Image
                  src={expert.img}
                  alt={expert.alt}
                  fill
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
                  className="rounded-full object-cover border-2 border-gray-400/30"
                  priority={index === 0}
                />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-1">
                {expert.name}
              </h3>
              {expert.title && (
                <p className="text-gray-400 text-xs mb-2">{expert.title}</p>
              )}
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                {expert.desc}
              </p>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}
