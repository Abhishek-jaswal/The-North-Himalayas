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
    <section
      id="contact"
      className="flex flex-col items-center justify-center py-16 px-6 sm:px-8 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          <span className="text-red-600">Contact</span> Me
        </h2>
        <div className="mx-auto mt-3 w-24 h-1 bg-gradient-to-r from-red-600 via-blue-600 to-blue-600 rounded-full" />
        <p className="text-gray-600 mt-3 max-w-md mx-auto text-sm sm:text-base">
          Feel free to reach out for collaborations, questions, or just to say hi 
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
          Send a Message
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500 focus:outline-none text-gray-700"
          />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500 focus:outline-none text-gray-700"
          />
          <input
            type="text"
            name="subject"
            placeholder="Contact"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500 focus:outline-none text-gray-700"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-red-500 focus:outline-none text-gray-700 resize-none"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-red-700  text-white font-medium hover:opacity-90 transition text-sm"
          >
            Send
          </button>
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
