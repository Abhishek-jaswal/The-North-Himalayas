"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const images = [
  "/images/packages/ladakh.jpg",
  "/images/packages/dharamshala5.jpg",
  "/images/crousal2.jpg",
  "/images/packages/kashmir2.jpg",
  "/images/packages/dharamshala1.jpg",
  "/images/packages/kashmir3.jpg"
];

export default function FullScreenCarousel() {
  return (
    <div className="w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-screen">
      
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            <Image
              src={src}
              alt={`Slide ${idx + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
             <h1 className="-mt-20 z-20 text-white">The North Himalayas</h1>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
}
