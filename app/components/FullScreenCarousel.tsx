// components/FullScreenCarousel.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const images = [
  "/images/ladakh.jpg",
  "/images/ladakh2.jpg",
  "/images/ladakh3.jpg"
];

export default function FullScreenCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-screen h-screen"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx} className=" w-screen h-screen relative">
          <Image
            src={src}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
