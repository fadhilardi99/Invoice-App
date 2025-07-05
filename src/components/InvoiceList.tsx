import React from "react";
import Link from "next/link";
import { Invoice } from "../types/invoice";

// Helper function to format dates
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Format as DD/MM/YYYY without time
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "N/A";
  }
};

// Helper function to format invoice number for display
const formatInvoiceNumber = (invoiceId: string): string => {
  // If it's already in the new format, extract the client name part
  if (invoiceId.startsWith("INVOICE-")) {
    const parts = invoiceId.split("-");
    if (parts.length >= 3) {
      const clientName = parts.slice(1, -1).join("-"); // Get all parts except first and last
      return `INVOICE - ${clientName}`;
    }
  }
  return invoiceId;
};

interface InvoiceListProps {
  invoices: Invoice[];
  search: string;
  status: string;
  onDelete?: () => void;
}

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  overdue: "Overdue",
};

const InvoiceCard: React.FC<{ invoice: Invoice; onDelete?: () => void }> = ({
  invoice,
  onDelete,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setLoading(true);
    setError(null);
    try {
      console.log("Deleting invoice:", invoice.id);
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Delete response:", data);
      if (data.success) {
        setError("✅ Invoice deleted successfully!");
        setTimeout(() => {
          if (onDelete) onDelete();
        }, 1000);
      } else {
        console.error("Delete failed:", data);
        setError(
          `❌ Failed to delete invoice: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("❌ Failed to delete invoice: Network error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      case "unpaid":
        return "bg-gradient-to-r from-yellow-500 to-orange-600 text-white";
      case "overdue":
        return "bg-gradient-to-r from-red-500 to-pink-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">📄</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formatInvoiceNumber(invoice.id)}
                </h3>
                <p className="text-gray-500 text-sm">{invoice.client.name}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                invoice.status
              )}`}
            >
              {statusLabel[invoice.status]}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">👤</span>
              <span className="text-gray-600">{invoice.client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-600">
                Due: {formatDate(invoice.client.dueDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">💰</span>
              <span className="text-gray-600">
                {invoice.total !== undefined
                  ? `Rp ${invoice.total.toLocaleString("id-ID")}`
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/invoice/${encodeURIComponent(invoice.id)}`}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
            >
              View Details
            </Link>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Send Email
            </button>
          </div>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          {error && (
            <div
              className={`text-xs p-2 rounded-lg ${
                error.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  search,
  status,
  onDelete,
}) => {
  const filtered = invoices.filter((inv) => {
    const matchStatus = status === "all" || inv.status === status;
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client?.name?.toLowerCase?.() || "").includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filtered.map((inv) => (
            <InvoiceCard key={inv.id} invoice={inv} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
