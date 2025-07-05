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
const statusClass: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
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
        if (onDelete) onDelete();
      } else {
        console.error("Delete failed:", data);
        setError(`Failed to delete invoice: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete invoice: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-xl font-bold">
            {formatInvoiceNumber(invoice.id)}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              statusClass[invoice.status]
            }`}
          >
            {statusLabel[invoice.status]}
          </span>
        </div>
        <div className="text-gray-700 text-sm">
          Client: <span className="font-semibold">{invoice.client.name}</span>
        </div>
        <div className="text-gray-500 text-xs">{invoice.client.email}</div>
        <div className="text-gray-500 text-xs">
          Due Date: {formatDate(invoice.client.dueDate)}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[180px]">
        <span className="text-blue-700 text-xl font-bold">
          {invoice.total !== undefined
            ? `Rp ${invoice.total.toLocaleString("id-ID")}`
            : "-"}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/invoice/${invoice.id}`}
            className="px-4 py-1 rounded border border-gray-200 text-gray-700"
          >
            View Details
          </Link>
          <button className="px-4 py-1 rounded bg-green-600 text-white">
            Send Email
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-1 rounded bg-red-600 text-white font-semibold"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
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
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No invoices found.</div>
      ) : (
        filtered.map((inv) => (
          <InvoiceCard key={inv.id} invoice={inv} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};

export default InvoiceList;
