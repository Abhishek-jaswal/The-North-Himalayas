"use client";

import Image from "next/image";

const images = [
  "/packages/package.jpg",
  "/images/packages/package1.jpg",
  "/images/package3.jpg",
  "/images/package4.jpg",
  "/images/package5.jpg",
  "/images/package6.jpg",
  "/images/package7.jpg",
  "/images/package8.jpg",
];

export default function ImageMarquee() {
  return (
    <div className="relative w-full overflow-hidden ">
      <div className="flex animate-marquee whitespace-nowrap">
        {images.concat(images).map((src, idx) => (
          <div
            key={idx}
            className="relative w-[150px] h-[90px] sm:w-[180px] sm:h-[110px] md:w-[250px] md:h-[150px] lg:w-[300px] lg:h-[180px] mx-2 flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Marquee ${idx}`}
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 250px, 300px"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
