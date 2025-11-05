"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatAppButton from "../components/WhatsAppButton";

export default function ContactPage() {
  return (
    <>
    <Navbar/>
    <section className="min-h-screen bg-black text-gray-200 py-20 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Let’s connect and plan your next unforgettable journey with{" "}
          <span className="text-white font-semibold">The North Himalayas</span>.
        </p>
      </motion.div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-400">
              Have questions or need help planning? We’re here to assist you with
              your travel dreams.
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-indigo-400 mt-1" />
              <div>
                <p>+91 80915 35250 | +91 98055 51911</p>
                <p>+91 80919 55310 | +91 98055 51311</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <p>info@thenorthhimalayas.com</p>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-400" />
              <a
                href="https://www.thenorthhimalayas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-300"
              >
                www.thenorthhimalayas.com
              </a>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
              <p>
                <span className="font-semibold text-white">Head Office:</span>
                <br />
                The North Himalayas Travel & Adventure Company<br />
                Near Radisson Blu, Khaniyara Road, Dharamshala – 176215<br />
                District Kangra, Himachal Pradesh
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-neutral-900 rounded-2xl shadow-2xl p-8 space-y-5 border border-white/10"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            Send Us a Message
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none text-gray-200"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none text-gray-200"
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-3 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none text-gray-200"
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            className="w-full px-4 py-3 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none text-gray-200 resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white transition-all duration-300"
          >
            Send Message
          </button>
        </motion.form>
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mt-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.807352029623!2d76.3318!3d32.2191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391b4d3adf5fffcf%3A0xb41b48d19b6e80f8!2sRadisson%20Blu%20Resort%20Dharamshala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="400"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>
    </section>
    <WhatAppButton/>
    <Footer/>
    </>
  );
}
