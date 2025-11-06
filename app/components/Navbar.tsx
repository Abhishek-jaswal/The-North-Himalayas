"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [openDest, setOpenDest] = useState(false);
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
const navLink = (label: string, onClick?: () => void) => (
<button
onClick={onClick}
className="px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Home"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-6 font-semibold text-sm text-gray-800">
          <li>{navLink("HOME", () => router.push("/"))}</li>

          <li className="relative" onMouseEnter={() => setOpenDest(true)} onMouseLeave={() => setOpenDest(false)}>
            <button
              aria-haspopup="menu"
              aria-expanded={openDest}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              DESTINATIONS <ChevronDown size={16} />
            </button>

            {openDest && (
              <ul className="absolute left-0 top-full mt-2 w-44 rounded-md bg-white shadow-md ring-1 ring-black/5 focus:outline-none">
                {[
                  { label: "Domestic" },
                  { label: "International" },
                
                ].map((d) => (
                  <li key={d.label} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {d.label}
                  </li>
                ))}
              </ul>
            )}
          </li>

            <li>{navLink("ABOUT US", () => router.push("/About"))}</li>

          <li>{navLink("CONTACT US", () => router.push("/contact"))}</li>
        </ul>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button
            aria-label="Toggle main menu"
            onClick={() => setMenuOpen((s) => !s)}
            className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white/95 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    className="w-full text-left px-4 py-3 rounded-md bg-black text-white font-semibold"
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
                    className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-black text-white font-semibold"
                    onClick={() => setOpenDest((s) => !s)}
                  >
                    DESTINATIONS <ChevronDown />
                  </button>
                </li>

                {openDest && (
                  <ul className="mt-1 rounded-md bg-gray-50">
                    {[
                      "Himachal Pradesh",
                      "Srinagar",
                      "Bali",
                    ].map((p) => (
                      <li key={p} className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}

                <li>
                  <button
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-100"
                    onClick={() => router.push("/About")}
                  >
                    ABOUT US
                  </button>
                </li>

                <li>
                  <button
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-100"
                    onClick={() => router.push("/contact")}
                  >
                    CONTACT US
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
