"use client";

import { motion } from "framer-motion";
import Slider from "react-slick";
import Image from "next/image";

const reviews = [
  {
    name: "Amit Sharma",
    location: "Delhi, India",
    review:
      "Our trip to Manali was perfectly organized! The hotel, food, and sightseeing were just amazing. Highly recommend this agency!",
    image: "",
  },
  {
    name: "Priya Nair",
    location: "",
    review:
      "Had an incredible experience in Kashmir. The team handled everything smoothly — from transport to accommodation. 10/10!",
    image: "",
  },
  {
    name: "Rahul Verma",
    location: "Pune, India",
    review:
      "The Rishikesh spiritual tour was rejuvenating. Well-planned itinerary and super friendly guides. Thank you for the memories!",
    image: "",
  },
  {
    name: "Simran Kaur",
    location: "Chandigarh, India",
    review:
      "We loved our Himachal package. Everything was seamless from start to finish. Will definitely book again!",
    image: "",
  },
];

export default function ReviewsSection() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-black px-4 py-16 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-4xl font-bold">
          What Our Travelers Say
        </h2>

        <div className="mx-auto mt-3 mb-10 w-24 h-1 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-800 rounded-full" />

        <Slider {...settings}>
          {reviews.map((r, i) => (
            <div key={i} className="px-2">
              <div className="h-full flex flex-col md:flex-row items-center gap-5 md:gap-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
                <Image
                  src={r.image}
                  alt={r.name}
                  width={90}
                  height={90}
                  className="rounded-full border-2 border-white/30 object-cover"
                />

                <div className="text-center md:text-left">
                  <p className="text-sm md:text-lg italic leading-relaxed text-gray-300 mb-4">
                    “{r.review}”
                  </p>
                  <h4 className="font-semibold text-lg md:text-xl">
                    {r.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400">
                    {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>

      <div className="mt-14 mx-auto w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-40" />
    </section>
  );
}
