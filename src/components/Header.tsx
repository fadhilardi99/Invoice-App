import React from "react";
import Link from "next/link";

const Header = () => (
  <div className="flex flex-col items-center mb-12">
    {/* Hero Section */}
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl opacity-10"></div>

      {/* Content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl">📄</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Invoice Manager
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            Streamline your billing process with our modern invoice management
            system. Create, track, and manage invoices with ease.
          </p>

          {/* CTA Button */}
          <Link href="/create-invoice">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center gap-3">
                <span className="text-xl">+</span>
                <span>Create New Invoice</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
