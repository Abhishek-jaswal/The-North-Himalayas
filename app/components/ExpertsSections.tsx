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
    name: "Sourabh",
    title: "Luxury Travel Designer",
    img: "/experts/suraj.jpg",
    desc: "Experienced and a little bit of perfectionist, Thuy loves to design the very best trip for clients. She will probably lose sleep over any detail that doesn’t go according to the plan.",
    alt: "Sourabh smiling outdoors",
  },
  {
    name: "Abhishek Kumar",
    title: "Southeast Asia Specialist",
    img: "/experts/abhishek.jpg",
    desc: "Abhishek likes to share everything he has seen with his clients and reveal the secret parts that not many travelers know.",
    alt: "Abhishek Kumar smiling outdoors",
  },
  {
    name: "Suraj Jaryal",
    title: "Cultural Experience Curator",
    img: "/experts/suraj.jpg",
    desc: "Suraj loves sharing the emotions and beauty he experiences while traveling, inspiring others to explore.",
    alt: "Suraj Jaryal beside a vehicle in mountains",
  },
  {
    name: "Ankaj Thakur",
    title: "Guest Experience Coordinator",
    img: "/experts/ankaj.jpg",
    desc: "Ankaj always feels happiest when his clients finish a trip with a smile and unforgettable memories.",
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

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
