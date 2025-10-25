"use client";
import { useState, FormEvent, ChangeEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setStatus(result.success ? "Message Sent!" : "Failed to send message");

    if (result.success) {
      setFormData({ email: "", name: "", subject: "", message: "" });
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Contact Banner Box */}
      <div className="w-full sm:w-[90%] max-w-6xl rounded-md bg-gradient-to-r from-[#7a004d] via-[#a0004d] to-[#3a005f] text-white shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center">
        {/* Headings */}
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide">
            Get Best Holiday Planned by Experts!
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mt-1">
            SEASONS SALE!!
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-5xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {/* Input Fields */}
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="flex-1 border-b border-pink-200 bg-transparent text-white placeholder-pink-200 focus:outline-none focus:border-pink-400 py-1 text-sm sm:text-base w-full sm:w-auto"
            />
            <input
              type="text"
              name="subject"
              placeholder="Mobile Number"
              value={formData.subject}
              onChange={handleChange}
              required
              className="flex-1 border-b border-pink-200 bg-transparent text-white placeholder-pink-200 focus:outline-none focus:border-pink-400 py-1 text-sm sm:text-base w-full sm:w-auto"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 border-b border-pink-200 bg-transparent text-white placeholder-pink-200 focus:outline-none focus:border-pink-400 py-1 text-sm sm:text-base w-full sm:w-auto"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-3 sm:mt-0 px-6 sm:px-8 py-2 bg-[#ff0055] hover:bg-[#ff2a6f] rounded-md font-semibold text-white transition-all text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Status Message */}
        {status && (
          <p
            className={`text-center mt-3 text-xs font-medium ${
              status === "Message Sent!" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
