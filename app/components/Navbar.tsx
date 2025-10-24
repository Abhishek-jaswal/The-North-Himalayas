"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [openDest, setOpenDest] = useState(false);
  const [openTours, setOpenTours] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo4.jpg" alt="Logo" width={60} height={20} />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 font-semibold text-sm text-gray-800">
          <li className="bg-red-600 text-white px-4 py-2 rounded-sm">HOME</li>

          {/* Destinations Dropdown */}
          <li
            className="relative cursor-pointer flex items-center gap-1 hover:text-pink-600"
            onMouseEnter={() => setOpenDest(true)}
            onMouseLeave={() => setOpenDest(false)}
          >
            DESTINATIONS <ChevronDown size={16} />
            {openDest && (
              <ul className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-40 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100">India</li>
                <li className="px-4 py-2 hover:bg-gray-100">Dubai</li>
                <li className="px-4 py-2 hover:bg-gray-100">Europe</li>
              </ul>
            )}
          </li>

          {/* Tours by Type Dropdown */}
          <li
            className="relative cursor-pointer flex items-center gap-1 hover:text-pink-600"
            onMouseEnter={() => setOpenTours(true)}
            onMouseLeave={() => setOpenTours(false)}
          >
            TOURS BY TYPE <ChevronDown size={16} />
            {openTours && (
              <ul className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md w-48 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100">Family Tours</li>
                <li className="px-4 py-2 hover:bg-gray-100">Adventure Tours</li>
                <li className="px-4 py-2 hover:bg-gray-100">Honeymoon Packages</li>
              </ul>
            )}
          </li>

          <li className="hover:text-pink-600 cursor-pointer">CONTACT US</li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t animate-slideDown">
          <ul className="flex flex-col text-gray-800 font-semibold">
            <li className="bg-pink-600 text-white px-6 py-3">HOME</li>

            <li
              className="px-6 py-3 flex justify-between items-center border-t"
              onClick={() => setOpenDest(!openDest)}
            >
              DESTINATIONS <ChevronDown size={16} />
            </li>
            {openDest && (
              <ul className="bg-gray-50 text-sm">
                <li className="px-8 py-2 hover:bg-gray-100">India</li>
                <li className="px-8 py-2 hover:bg-gray-100">Dubai</li>
                <li className="px-8 py-2 hover:bg-gray-100">Europe</li>
              </ul>
            )}

            <li
              className="px-6 py-3 flex justify-between items-center border-t"
              onClick={() => setOpenTours(!openTours)}
            >
              TOURS BY TYPE <ChevronDown size={16} />
            </li>
            {openTours && (
              <ul className="bg-gray-50 text-sm">
                <li className="px-8 py-2 hover:bg-gray-100">Family Tours</li>
                <li className="px-8 py-2 hover:bg-gray-100">Adventure Tours</li>
                <li className="px-8 py-2 hover:bg-gray-100">Honeymoon Packages</li>
              </ul>
            )}

            <li className="px-6 py-3 border-t hover:bg-gray-100">CONTACT US</li>
          </ul>
        </div>
      )}
    </nav>
  );
}
