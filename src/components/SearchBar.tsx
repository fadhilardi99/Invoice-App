import React from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const statuses = [
  { label: "All", value: "all", className: "bg-blue-600 text-white" },
  { label: "Paid", value: "paid", className: "bg-green-100 text-green-700" },
  {
    label: "Unpaid",
    value: "unpaid",
    className: "bg-yellow-100 text-yellow-700",
  },
  { label: "Overdue", value: "overdue", className: "bg-red-100 text-red-700" },
];

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  status,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center gap-4 w-full max-w-5xl mb-8">
      <input
        type="text"
        placeholder="Search invoices by client name or invoice number..."
        className="flex-1 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="flex gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            className={`px-4 py-1 rounded font-semibold transition ${
              status === s.value ? s.className : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => onStatusChange(s.value)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
