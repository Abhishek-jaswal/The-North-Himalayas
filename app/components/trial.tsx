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
    <section className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black">
      {/* Gradient Contact Box */}
      <div className="w-full sm:w-[90%] max-w-5xl rounded-2xl bg-black text-white shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center -mt-40 z-10">
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
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-4xl"
        >
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="flex-1 min-w-[180px] px-4 py-2 sm:py-2.5 rounded-full bg-transparent border border-pink-200 text-white placeholder-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400 text-sm sm:text-base"
          />
          <input
            type="text"
            name="subject"
            placeholder="Mobile Number"
            value={formData.subject}
            onChange={handleChange}
            required
            className="flex-1 min-w-[180px] px-4 py-2 sm:py-2.5 rounded-full bg-transparent border border-pink-200 text-white placeholder-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400 text-sm sm:text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="flex-1 min-w-[180px] px-4 py-2 sm:py-2.5 rounded-full bg-transparent border border-pink-200 text-white placeholder-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400 text-sm sm:text-base"
          />

          <button
            type="submit"
            className="px-6 sm:px-8 py-2 sm:py-2.5 bg-[#ff0055] hover:bg-[#ff2a6f] rounded-full font-semibold text-white transition-all text-sm sm:text-base"
          >
            Submit
          </button>
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
