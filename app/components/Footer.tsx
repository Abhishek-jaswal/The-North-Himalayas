"use client";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-800 via-neutral-900 to-black text-gray-300  px-6">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">The North Himalayas</h2>
          <p className="text-sm leading-relaxed">
            Travel & Adventure Company <br />
            Near Radisson Blu, Khaniyara Road, <br />
            Dharamshala – 176215, District Kangra, <br />
            Himachal Pradesh
          </p>
          <p className="mt-4 text-sm">
            🌐 <a href="https://www.thenorthhimalayas.com" className="hover:underline text-white">www.thenorthhimalayas.com</a>
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-1 text-sm">
            <li>📞 +91 80915 35250 / +91 98055 51911</li>
            <li>📞 +91 80919 55310 / +91 98055 51311</li>
            <li>✉️ <a href="mailto:hello@thenorthhimalayas.com" className="hover:underline">hello@thenorthhimalayas.com</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Cancellation Policy & T&Cs</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Trip Payments</a></li>
            <li><a href="#" className="hover:underline">Customer Support</a></li>
            <li><a href="#" className="hover:underline">Reviews</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-5 text-xl">
            <a href="https://www.facebook.com/share/17TPLZdctu/" className="hover:text-blue-400"><FaFacebookF /></a>
            <a href="https://www.instagram.com/thenorthhimalayas?igsh=NW14aTk1d3hvbHhl" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="https://www.youtube.com/@thenorthhimalayas" className="hover:text-red-500"><FaYoutube /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 text-center text-sm opacity-80">
        © {new Date().getFullYear()} The North Himalayas. All rights reserved.
      </div>
    </footer>
  );
}
