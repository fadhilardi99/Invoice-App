import React from "react";
import Link from "next/link";

const Header = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="bg-blue-600 rounded-full p-4 mb-4">
      <span className="text-white text-3xl">📄</span>
    </div>
    <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">
      Invoice Manager
    </h1>
    <p className="text-gray-600 text-center max-w-xl mb-4">
      Streamline your billing process with our modern invoice management system
    </p>
    <Link href="/create-invoice">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mb-2 transition">
        + Create New Invoice
      </button>
    </Link>
  </div>
);

export default Header;
