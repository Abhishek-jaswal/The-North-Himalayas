"use client";
import { useState, FormEvent, ChangeEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
    customMessage: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      setFormData({
        email: "",
        name: "",
        subject: "",
        message: "",
        customMessage: "",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full flex flex-col items-center justify-center px-4 bg-black"
    >
      {/* Watermark heading (hidden on mobile) */}
      <h1 className="hidden sm:block text-none sm:text-[11rem] sm:-mt-[30rem] -mt-[20rem] items-center justify-center font-bold pl-10 sm:pl-40 text-black/60 select-none pointer-events-none z-10">
        THE NORTH HIMALAYAS
      </h1>

      {/* Form container */}
      <div className="w-full sm:w-[90%] max-w-5xl rounded-2xl bg-black text-white shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center z-10 bg-black/50 -mt-60 sm:mt-3 ">
        {/* Title */}
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
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl"
        >
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:py-2.5 bg-transparent border-b border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 text-sm sm:text-base"
          />

          <input
            type="text"
            name="subject"
            placeholder="Mobile Number"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:py-2.5 bg-transparent border-b border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 text-sm sm:text-base"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:py-2.5 bg-transparent border-b border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 text-sm sm:text-base"
          />

          <select
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:py-2.5 bg-transparent border-b border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 text-sm sm:text-base appearance-none"
          >
            <option value="" disabled className="bg-black text-gray-600">
              Select Message
            </option>
            <option value="Query" className="bg-black text-white">
              Query
            </option>
            <option value="Suggestion" className="bg-black text-white">
              Suggestion
            </option>
            <option value="Type" className="bg-black text-white">
              Type your own
            </option>
          </select>

          {formData.message === "Type" && (
            <input
              type="text"
              name="customMessage"
              placeholder="Write your message..."
              value={formData.customMessage}
              onChange={handleChange}
              className="w-full px-4 py-2 sm:py-2.5 bg-transparent border-b border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 text-sm sm:text-base"
            />
          )}

          {/* Submit button spans full width */}
          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-6 sm:px-8 py-2 sm:py-2.5 bg-gray-100 rounded-full font-semibold text-black transition-all hover:bg-gray-300 text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>

        {status && (
          <p
            className={`text-center mt-3 text-xs font-medium ${
              status === "Message Sent!" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
