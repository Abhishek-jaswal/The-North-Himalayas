"use client";

import Image from "next/image";

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
  return (
    <div className="relative w-full overflow-hidden mt-8 mb-8">
      <div className="flex animate-marquee whitespace-nowrap gap-4">
        {images.concat(images).map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt={`Marquee ${idx}`}
            width={300} // default width, responsive handled below
            height={250} // default height
            className="object-contain rounded-xl shadow-lg
              w-[150px] h-[90px] sm:w-[180px] sm:h-[110px]
              md:w-[250px] md:h-[150px] lg:w-[300px] lg:h-[250px]"
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 250px, 300px"
          />
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
