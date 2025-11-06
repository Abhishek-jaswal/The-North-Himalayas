"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, Phone, Globe, Mail } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [openDest, setOpenDest] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLink = (label: string, onClick?: () => void) => (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-md transition-all duration-200 focus:outline-none hover:text-blue-600"
    >
      {label}
    </button>
  );

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 backdrop-blur-sm ${
        scrolled ? "bg-white/95 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-3 md:gap-0">
        {/* --- Left Section: Logo + Contact Info --- */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          {/* Logo */}
          <button
            aria-label="Home"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 focus:outline-none"
          >
            <Image
              src="/images/logos/logo_5.jpg"
              alt="The North Himalayas logo"
              width={60}
              height={40}
              className="rounded-sm"
            />
            <span className="sr-only">The North Himalayas</span>
          </button>

          {/* Contact info (visible only on desktop) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium">
            <a
              href="tel:+919805551311"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Phone size={16} />
              +91 98055 51311
            </a>
            <a
              href="mailto:info@thenorthhimalayas.com"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Mail size={16} />
              info@thenorthhimalayas.com
            </a>
            <a
              href="https://thenorthhimalayas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Globe size={16} />
              thenorthhimalayas.com
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle main menu"
              onClick={() => setMenuOpen((s) => !s)}
              className="rounded-md p-1 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- Desktop Menu --- */}
        <ul className="hidden md:flex items-center gap-6 font-semibold text-sm text-gray-800">
          <li>{navLink("HOME", () => router.push("/"))}</li>

          <li
            className="relative"
            onMouseEnter={() => setOpenDest(true)}
            onMouseLeave={() => setOpenDest(false)}
          >
            <button
              aria-haspopup="menu"
              aria-expanded={openDest}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md focus:outline-none"
            >
              DESTINATIONS <ChevronDown size={16} />
            </button>

            {openDest && (
              <ul className="absolute left-0 top-full mt-2 w-44 rounded-md bg-white shadow-md ring-1 ring-black/5 focus:outline-none z-50">
                {["Domestic", "International"].map((label) => (
                  <li
                    key={label}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>{navLink("ABOUT US", () => router.push("/About"))}</li>
          <li>{navLink("CONTACT US", () => router.push("/contact"))}</li>
        </ul>
      </div>

      {/* --- Mobile Dropdown --- */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white/95 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    className="w-full text-left px-4 py-3 rounded-md bg-black text-sm text-white font-semibold"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/");
                    }}
                  >
                    HOME
                  </button>
                </li>

                <li>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-black text-white text-sm font-semibold"
                    onClick={() => setOpenDest((s) => !s)}
                  >
                    DESTINATIONS <ChevronDown />
                  </button>
                </li>

                {openDest && (
                  <ul className="mt-1 rounded-md bg-gray-50 text-sm ">
                    {["Himachal Pradesh", "Srinagar", "Bali"].map((p) => (
                      <li
                        key={p}
                        className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                )}

                <li>
                  <button
                    className="w-full text-left px-4 text-sm py-3 rounded-md hover:bg-gray-100"
                    onClick={() => router.push("/About")}
                  >
                    ABOUT US
                  </button>
                </li>

                <li>
                  <button
                    className="w-full text-left px-4 text-sm  py-3 rounded-md hover:bg-gray-100"
                    onClick={() => router.push("/contact")}
                  >
                    CONTACT US
                  </button>
                </li>

                {/* Contact info for mobile */}
                <li className="mt-4 border-t pt-3 text-sm text-gray-700">
                  <div className="flex flex-col gap-2">
                    <a href="tel:+919805551311" className="flex items-center gap-2">
                      <Phone size={16} /> +91 98055 51311
                    </a>
                    <a
                      href="mailto:info@thenorthhimalayas.com"
                      className="flex items-center gap-2"
                    >
                      <Mail size={16} /> info@thenorthhimalayas.com
                    </a>
                    <a
                      href="https://thenorthhimalayas.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Globe size={16} /> thenorthhimalayas.com
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
