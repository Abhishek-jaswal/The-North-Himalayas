"use client";

import Image from "next/image";
import { useEffect } from "react";

const images = [
  "/images/packages/package1.png",
  "/images/packages/package.jpg",
  "/images/packages/package2.jpg",
  "/images/packages/package3.jpg",
  "/images/packages/package4.jpg",
  "/images/packages/package5.jpg",
  "/images/packages/package6.jpg",
  "/images/packages/package7.jpg",
];

export default function ImageMarquee() {
  // Inject smooth marquee animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes scroll-reverse {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
      }
      .animate-scroll {
        animation: scroll 35s linear infinite;
      }
      .animate-scroll-reverse {
        animation: scroll-reverse 40s linear infinite;
      }
      .group:hover .animate-scroll,
      .group:hover .animate-scroll-reverse {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden pb-12 bg-gradient-to-b from-black via-[#0d0d0d] to-black">
      {/* Fade edges for seamless scrolling */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-black z-10" />

      {/* Heading */}
      <h2 className="text-center text-3xl sm:text-4xl font-bold mb-10 text-white tracking-wide">
        <span className="text-gray-100">
          Our Travel Highlights 
        </span>
        <div className="mx-auto mt-3 w-32 h-1 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-900 rounded-full" />
      </h2>

      {/* Forward Marquee */}
      <div className="group relative flex overflow-hidden mb-10">
        <div className="flex animate-scroll whitespace-nowrap gap-6">
          {images.concat(images).map((src, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transform transition-all duration-500 hover:scale-105"
            >
              <Image
                src={src}
                alt={`Marquee image ${idx}`}
                width={320}
                height={220}
                className="object-cover w-[160px] h-[100px] sm:w-[220px] sm:h-[130px] md:w-[280px] md:h-[180px] lg:w-[320px] lg:h-[220px] brightness-75 hover:brightness-110 transition-all duration-500 rounded-2xl"
                priority={idx < 5}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reverse Marquee */}
      <div className="group relative flex overflow-hidden">
        <div className="flex animate-scroll-reverse whitespace-nowrap gap-6">
          {images.concat(images).map((src, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transform transition-all duration-500 hover:scale-105"
            >
              <Image
                src={src}
                alt={`Marquee reverse ${idx}`}
                width={320}
                height={220}
                className="object-cover w-[160px] h-[100px] sm:w-[220px] sm:h-[130px] md:w-[280px] md:h-[180px] lg:w-[320px] lg:h-[220px] brightness-75 hover:brightness-110 transition-all duration-500 rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-60"></div>
    </div>
  );
}
