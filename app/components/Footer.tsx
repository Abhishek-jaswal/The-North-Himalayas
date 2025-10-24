import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-6">
      {/* Top Row - Main Links */}
      <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base font-semibold text-center">
        <a href="#" className="hover:underline">Cancellation Policy And T&Cs</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Contact Us</a>
        <a href="#" className="hover:underline">Careers</a>
        <a href="#" className="hover:underline">Trip Payments</a>
        <a href="#" className="hover:underline">Customer Support</a>
        <a href="#" className="hover:underline">Reviews</a>
      </div>

      {/* Middle Row - Destinations */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm md:text-base">
        <a href="#" className="hover:underline">Ladakh</a>
        <a href="#" className="hover:underline">Spiti Valley</a>
        <a href="#" className="hover:underline">Maldives</a>
        <a href="#" className="hover:underline">Bhutan</a>
        <a href="#" className="hover:underline">Meghalaya</a>
        <a href="#" className="hover:underline">Corporate Bookings</a>
      </div>

      {/* Social Icons */}
      <div className="mt-6 flex justify-center gap-6 text-lg">
        <a href="https://www.facebook.com/share/17TPLZdctu/" className="hover:text-gray-200"><FaFacebookF /></a>
        <a href="https://www.youtube.com/@thenorthhimalayas" className="hover:text-gray-200"><FaTwitter /></a>
        <a href="https://www.instagram.com/thenorthhimalayas?igsh=NW14aTk1d3hvbHhl" className="hover:text-gray-200"><FaInstagram /></a>
        <a href="https://www.youtube.com/@thenorthhimalayas" className="hover:text-gray-200"><FaYoutube /></a>
      </div>

      {/* Bottom - Optional Small Text */}
      <p className="mt-6 text-center text-xs md:text-sm opacity-80">
        © {new Date().getFullYear()} The North Himalayas. All rights reserved.
      </p>
    </footer>
  );
}
