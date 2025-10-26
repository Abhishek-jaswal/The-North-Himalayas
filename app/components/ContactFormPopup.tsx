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
    const timer = setTimeout(() => setShowPopup(true), 5000);
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
      setShowPopup(false);
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-xs p-4 relative shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">
              Plan Your Holiday
            </h2>

            {/* Form */}
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="subject"
                placeholder="Mobile"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white"
              />

              <input
                type="number"
                name="persons"
                placeholder="Persons"
                value={formData.persons}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white"
              />

              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white"
              />

              <select
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white"
              >
                <option value="" disabled>
                  Message
                </option>
                <option value="Query">Query</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Type">Custom</option>
              </select>

              {formData.message === "Type" && (
                <input
                  type="text"
                  name="customMessage"
                  placeholder="Write message..."
                  value={formData.customMessage}
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-gray-900 dark:text-white"
                />
              )}

              <button className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded text-sm mt-1">
                Submit
              </button>
            </form>

            {status && (
              <p
                className={`mt-2 text-center text-xs font-medium ${
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
