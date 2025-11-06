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
    image: "/experts/abhikumar.jpg",
  },
  {
    name: "Priya Nair",
    location: "Mumbai, India",
    review:
      "Had an incredible experience in Kashmir. The team handled everything smoothly — from transport to accommodation. 10/10!",
    image: "/experts/surajj.jpg",
  },
  {
    name: "Rahul Verma",
    location: "Pune, India",
    review:
      "The Rishikesh spiritual tour was rejuvenating. Well-planned itinerary and super friendly guides. Thank you for the memories!",
    image: "/experts/ankaj.jpg",
  },
  {
    name: "Simran Kaur",
    location: "Chandigarh, India",
    review:
      "We loved our Himachal package. Everything was seamless from start to finish. Will definitely book again!",
    image: "/experts/sourabh.jpg",
  },
];

export default function ReviewsSection() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 2, // ✅ show 2 reviews side by side
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // ✅ show 1 on mobile
        },
      },
    ],
  };

  return (
    <section className="w-full bg-gradient-to-b from-black to-gray-900 opacity-90 px-4 text-white py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          What Our Travelers Say
        </h2>

        <Slider {...settings}>
          {reviews.map((r, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg mx-3 bg-white/5">
                <Image
                  src={r.image}
                  alt={r.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white/30 object-cover"
                />
                <div className="text-left max-w-md">
                  <p className="text-lg italic mb-4 leading-relaxed text-gray-200">
                    “{r.review}”
                  </p>
                  <h4 className="font-semibold text-xl">{r.name}</h4>
                  <p className="text-sm text-gray-400">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>

      {/* --- Decorative Line --- */}
      <div className="my-12 mx-auto w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-50" />
    </section>
  );
}
