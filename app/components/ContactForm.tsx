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
      className="relative w-full flex flex-col items-center justify-center px-4  bg-black"
    >
          <h1 className=" text-[3rem] sm:text-[11rem] -mt-[30rem] items-center justify-center font-bold pl-14 sm:pl-40 text-black/60 select-none pointer-events-none z-10">
    THE NORTH HIMALAYAS
  </h1> 
      {/* Title */}
      <div className="w-full sm:w-[90%] max-w-5xl rounded-2xl bg-black text-white shadow-2xl p-6 pt-2 sm:p-2 flex flex-col items-center justify-center  z-10 bg-black/50">
   
          <div className="text-center  h-10">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide">
            Get Best Holiday Planned by Experts!
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mt-1">
            SEASONS SALE!!
          </p>
        </div>

      {/* Form */}
    

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-4xl mt-10">
       
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
            className="px-6 sm:px-8 py-2 sm:py-2.5 bg-gray-100  rounded-full font-semibold text-black transition-all text-sm sm:text-base"
          >
            Submit
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
