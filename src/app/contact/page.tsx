"use client";
import CapitalizeFirst from "@/components/CapitalizeFirst";
import React, { useState } from "react";

// interface Person {
//   name: string;
//   email: string;
//   message: string;
// }

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const subject = encodeURIComponent(`Message from ${formData.name}`);
  const body = encodeURIComponent(
    `Email: ${formData.email}\n\n${formData.message}`
  );
  
  // Direct Gmail web URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@sleeptracker.com&su=${subject}&body=${body}`;
  
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');
};

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-8 bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          <CapitalizeFirst>contact sleeptracker</CapitalizeFirst>
        </h1>
        <p className="text-lg md:text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          <CapitalizeFirst>
            Have questions or need help? Get in touch with us!
          </CapitalizeFirst>
        </p>
      </section>
      {/* Contact Form Section */}
      <section className="py-16 px-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          <CapitalizeFirst>get in touch</CapitalizeFirst>
        </h2>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="name..."
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-md font-medium shadow-md cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </section>
      {/* Contact Information Section */}
      <section className="py-16 px-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Information</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600">nextDev@gmail.com</p>
            </div>
            <div>
            <h3 className='text-xl font-bold mb-2'>Phone</h3>
            <p className='text-gray-600'>+1 (123) 456-7890</p>
          </div>
          <div>
            <h3 className='text-xl font-bold mb-2'>Address</h3>
            <p className='text-gray-600'>
              Singapore
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
