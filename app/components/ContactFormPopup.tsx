"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { X } from "lucide-react";

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

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000); // show after 5 sec
    return () => clearTimeout(timer);
  }, []);

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
        date: "",
        persons: "",
        destination: "",
      });
      setShowPopup(false); // close popup on success
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl animate-fadeIn">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Plan Your Holiday
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:gap-6"
            >
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="subject"
                placeholder="Mobile Number"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="persons"
                placeholder="Total Persons"
                value={formData.persons}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />

              <select
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
              >
                <option value="" disabled>
                  Select Message
                </option>
                <option value="Query">Query</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Type">Type your own</option>
              </select>

              {formData.message === "Type" && (
                <input
                  type="text"
                  name="customMessage"
                  placeholder="Write your message..."
                  value={formData.customMessage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                />
              )}

              <button
                type="submit"
                className="w-full py-2 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all"
              >
                Submit
              </button>
            </form>
            {status && (
              <p
                className={`mt-3 text-center font-medium ${
                  status === "Message Sent!" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
