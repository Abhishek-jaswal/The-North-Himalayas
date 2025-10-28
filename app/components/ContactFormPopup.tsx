"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  X,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function ContactFormPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
    customMessage: "",
    date: "",
    persons: "",
    destination: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setIsSubmitting(false);
      setTimeout(() => {
        setFormData({
          email: "",
          name: "",
          subject: "",
          message: "",
          customMessage: "",
          date: "",
          persons: "",
          destination: "",
        });
        setShowPopup(false);
        setStatus("");
      }, 5000);
    }, 1500);
  };

  const handleClose = () => setShowPopup(false);
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-sm bg-neutral-900 rounded-2xl shadow-xl overflow-hidden animate-popup-enter text-gray-200">
        {/* Header */}
        <div className="h-24 bg-black relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Plan Your Dream Holiday
            </h2>
            <p className="text-xs text-white/90">Let&apos;s create memories 🌴</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                name="subject"
                placeholder="Mobile Number"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none"
              />
            </div>

            {/* Grid for Date & Persons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-2 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none "
                />
              </div>
              <div className="relative">
                <Users
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  name="persons"
                  placeholder="Persons"
                  min={1}
                  value={formData.persons}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none "
                />
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="destination"
                placeholder="Destination (e.g., Bali)"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none"
              />
            </div>

            {/* Inquiry Type */}
            <select
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent text-gray-200 focus:border-indigo-400 focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-400/30 outline-none bg-black"
            >
              <option value="" disabled>
                Select inquiry type
              </option>
              <option value="Query" className="text-gray-200">General Query</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Type">Custom Message</option>
            </select>

            {formData.message === "Type" && (
              <textarea
                name="customMessage"
                placeholder="Tell us more..."
                value={formData.customMessage}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-700 bg-transparent text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 outline-none resize-none"
              />
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting || status === "success"}
              className="w-full py-2.5 bg-black hover:bg-gray-900 rounded-lg text-sm font-medium text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              {status === "success" ? (
                <>
                  <CheckCircle2 size={16} />
                  Sent!
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Plan Holiday <Send size={14} />
                </>
              )}
            </button>

            {status === "success" && (
              <p className="text-green-400 text-center text-xs">
                We&apos;ll contact you soon 🌺
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
