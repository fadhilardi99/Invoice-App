import React from "react";

interface SearchBarProps {
  onSearch: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  status,
  onStatusChange,
}) => {
  const statusOptions = [
    { value: "all", label: "All", icon: "📋" },
    { value: "paid", label: "Paid", icon: "✅" },
    { value: "unpaid", label: "Unpaid", icon: "⏳" },
    { value: "overdue", label: "Overdue", icon: "⚠️" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search invoices by client name or invoice number..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3 flex-wrap justify-center lg:justify-end">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`group flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  status === option.value
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span>{option.label}</span>
                {status === option.value && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
