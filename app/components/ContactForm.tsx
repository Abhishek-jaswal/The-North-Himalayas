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
    <div className="flex flex-col mt-10 items-center justify-center p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black">
     <div className="text-center " id='contact'>
  <h2 className="text-4xl font-bold">Contact</h2>
  <p className="text-gray-400 mt-2">
  Feel free to reach out to me for any questions or opportunities!
  </p>
</div>
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl mt-10 w-full max-w-md ">
      <h2 className="text-white text-2xl font-bold  mb-4">
        Email Me 🚀
      </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 rounded-lg bg-gray-900 border border-purple-500 text-white"
          />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 rounded-lg  bg-gray-900 border border-purple-500 text-white"
          />
          <input
            type="text"
            name="subject"
            placeholder="contact"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 rounded-lg  bg-gray-900 border border-purple-500 text-white"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 rounded-lg  bg-gray-900 border border-purple-500 text-white h-24"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded-lg  hover:bg-purple-700 transition"
          >
            Send
          </button>
        </form>
        {status && <p className="text-center mt-2">{status}</p>}
      </div>
    </div>
  );
}