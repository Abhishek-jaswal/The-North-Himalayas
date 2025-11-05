"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const images = [
  "/images/packages/ladakh.jpg",
    "/images/packages/kashmir5.jpg",
  "/images/packages/dharamshala1.jpg",
  "/images/packages/dharamshala.jpg",
  "/images/packages/ladakh3.jpg",
  "/images/packages/kashmir1.jpg",
 "/images/crousal/crousal1.jpg",
 "/images/crousal/crousal2.jpg",
 "/images/crousal/crousal3.jpg",
 "/images/crousal/crousal4.jpg",
 "/images/crousal/crousal5.jpg",

];

// 7897417379
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
            
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
}
