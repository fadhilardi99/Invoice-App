"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Invoice, InvoiceItem, ClientInfo } from "@/types/invoice";
import Spinner from "@/components/Spinner";

// Type declaration for html2pdf
declare global {
  interface Window {
    html2pdf: (
      element: HTMLElement,
      options?: {
        margin?: number;
        filename?: string;
        html2canvas?: { scale?: number };
        jsPDF?: { unit?: string; format?: string; orientation?: string };
      }
    ) => void;
  }
}

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

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<{
    client: ClientInfo;
    status: Invoice["status"];
    items: InvoiceItem[];
  } | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const invoiceRef = React.useRef<HTMLDivElement>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  // Validasi edit real-time
  React.useEffect(() => {
    if (!editMode || !editData) return;
    const newErrors: { [key: string]: string } = {};
    if (!editData.client.name) newErrors.name = "Client name is required";
    if (!editData.client.email) newErrors.email = "Client email is required";
    if (!editData.client.dueDate) newErrors.dueDate = "Due date is required";
    if (editData.items.length === 0)
      newErrors.items = "At least 1 item required";
    editData.items.forEach((item, idx) => {
      if (!item.name) newErrors[`item-name-${idx}`] = "Item name required";
      if (item.quantity <= 0)
        newErrors[`item-qty-${idx}`] = "Quantity must be > 0";
      if (item.price < 0) newErrors[`item-price-${idx}`] = "Price must be ≥ 0";
    });
    setEditErrors(newErrors);
  }, [editData, editMode]);

  const isEditValid = Object.keys(editErrors).length === 0;

  useEffect(() => {
    setLoading(true);
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.invoices.find((inv: Invoice) => inv.id === id);
          if (found) {
            setInvoice(found);
            setError(null);
          } else {
            setError("Invoice not found");
          }
        } else {
          setError("Failed to fetch invoice");
        }
      })
      .catch(() => setError("Failed to fetch invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      console.log("Deleting invoice:", id);
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      const data = await res.json();
      console.log("Delete response:", data);
      if (data.success) {
        toast.success("Invoice deleted successfully!");
        router.push("/");
      } else {
        console.error("Delete failed:", data);
        setDeleteError(
          `Failed to delete invoice: ${data.error || "Unknown error"}`
        );
        toast.error(
          `Failed to delete invoice: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("Failed to delete invoice: Network error");
      toast.error("Failed to delete invoice: Network error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const startEdit = () => {
    if (!invoice) return;
    setEditData({
      client: { ...invoice.client },
      status: invoice.status,
      items: invoice.items
        ? invoice.items.map((item: InvoiceItem) => ({ ...item }))
        : [],
    });
    setEditMode(true);
    setEditError(null);
  };

  const handleEditChange = (
    field: keyof ClientInfo | "status",
    value: string
  ) => {
    if (field === "status")
      setEditData((d) => d && { ...d, status: value as Invoice["status"] });
    else
      setEditData(
        (d) => d && { ...d, client: { ...d.client, [field]: value } }
      );
  };

  const handleEditItemChange = (
    idx: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setEditData(
      (d) =>
        d && {
          ...d,
          items: d.items.map((item, i) =>
            i === idx
              ? { ...item, [field]: field === "name" ? value : Number(value) }
              : item
          ),
        }
    );
  };

  const handleAddEditItem = () => {
    setEditData(
      (d) =>
        d && { ...d, items: [...d.items, { name: "", quantity: 1, price: 0 }] }
    );
  };

  const handleRemoveEditItem = (idx: number) => {
    setEditData(
      (d) => d && { ...d, items: d.items.filter((_, i) => i !== idx) }
    );
  };

  const editTotal =
    editData?.items?.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) || 0;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: editData.client,
          status: editData.status,
          items: editData.items,
          total: editTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInvoice(data.invoice);
        setEditMode(false);
        toast.success("Invoice updated!");
      } else {
        setEditError("Failed to update invoice.");
        toast.error("Failed to update invoice.");
      }
    } catch {
      setEditError("Failed to update invoice.");
      toast.error("Failed to update invoice.");
    } finally {
      setEditLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    // Load html2pdf.js via CDN jika belum ada
    if (!window.html2pdf) {
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }
    window.html2pdf(invoiceRef.current, {
      margin: 0.5,
      filename: `${invoice?.id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  };

  const handleSendEmail = async () => {
    setEmailLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setEmailLoading(false);
    toast.success(
      "Invoice sent to " +
        (invoice?.client?.email || "client email") +
        " (simulasi)"
    );
  };

  if (loading)
    return (
      <div className="py-16">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 flex flex-col items-center font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center gap-2 mb-4 px-1 sm:px-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium"
        >
          <span className="text-xl">←</span> Back to Dashboard
        </Link>
        <div className="flex-1 text-center text-2xl font-bold text-blue-900 flex items-center justify-center gap-2">
          <span className="bg-blue-600 rounded-full p-2 text-white text-2xl">
            📄
          </span>
          {formatInvoiceNumber(invoice.id)}
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded text-xs font-semibold ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-700"
                : invoice.status === "overdue"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {invoice.status
              ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
              : "-"}
          </span>
        </div>
      </div>
      {/* Action Bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 px-1 sm:px-0">
        <div className="text-gray-500 text-sm">
          Created: {formatDate(invoice.client?.createdAt)}
        </div>
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="px-3 py-1 rounded border text-gray-700 w-full sm:w-auto"
          >
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1 rounded border text-gray-700 w-full sm:w-auto"
          >
            Download PDF
          </button>
          <button
            onClick={handleSendEmail}
            disabled={emailLoading}
            className="px-3 py-1 rounded bg-green-600 text-white w-full sm:w-auto"
          >
            {emailLoading ? "Sending..." : "Send Email"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="px-3 py-1 rounded bg-red-600 text-white font-semibold w-full sm:w-auto"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={startEdit}
            className="px-3 py-1 rounded bg-blue-600 text-white font-semibold w-full sm:w-auto"
          >
            Edit
          </button>
        </div>
      </div>
      {deleteError && (
        <div className="text-red-500 text-center mb-4">{deleteError}</div>
      )}
      {editMode && (
        <form
          onSubmit={handleEditSubmit}
          className="w-full max-w-4xl bg-blue-50 rounded-lg p-4 sm:p-6 mb-6"
        >
          <div className="font-semibold mb-2">Edit Invoice</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="Client Name"
              value={editData!.client.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Client Email"
              value={editData!.client.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Due Date"
              type="date"
              value={editData!.client.dueDate}
              onChange={(e) => handleEditChange("dueDate", e.target.value)}
            />
          </div>
          {(editErrors.name || editErrors.email || editErrors.dueDate) && (
            <div className="text-red-500 text-sm mb-2">
              {[editErrors.name, editErrors.email, editErrors.dueDate]
                .filter(Boolean)
                .join(" | ")}
            </div>
          )}
          <div className="mb-4">
            <select
              className="border rounded px-3 py-2"
              value={editData!.status}
              onChange={(e) => handleEditChange("status", e.target.value)}
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Invoice Items</div>
            {editData!.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-center"
              >
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) =>
                    handleEditItemChange(idx, "name", e.target.value)
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Quantity"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleEditItemChange(idx, "quantity", e.target.value)
                  }
                />
                <input
                  className="border rounded px-2 py-1"
                  placeholder="Price (IDR)"
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) =>
                    handleEditItemChange(idx, "price", e.target.value)
                  }
                />
                <div className="text-green-700 font-bold">
                  Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEditItem(idx)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
                >
                  ×
                </button>
              </div>
            ))}
            {editErrors.items && (
              <div className="text-red-500 text-xs mb-2">
                {editErrors.items}
              </div>
            )}
            {editData!.items.map((item, idx) => (
              <div key={idx} className="text-red-500 text-xs">
                {[
                  editErrors[`item-name-${idx}`],
                  editErrors[`item-qty-${idx}`],
                  editErrors[`item-price-${idx}`],
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEditItem}
              className="mt-2 px-3 py-1 rounded bg-green-600 text-white font-semibold"
            >
              + Add Item
            </button>
          </div>
          <div className="mb-4 flex justify-end">
            <div className="bg-blue-100 rounded-lg p-3 min-w-[180px] text-right">
              <div className="text-gray-500 text-sm mb-1">Invoice Total:</div>
              <div className="text-xl font-bold text-blue-700">
                Rp {editTotal.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
          {editError && (
            <div className="text-red-500 text-sm mb-2">{editError}</div>
          )}
          <div className="flex gap-2 justify-end flex-col sm:flex-row">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 rounded border w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading || !isEditValid}
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold w-full sm:w-auto"
            >
              {editLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
      <div
        ref={invoiceRef}
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
          <div>
            <div className="text-2xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-400 px-4 py-2 rounded-t-lg mb-2">
              INVOICE
            </div>
            <div className="text-sm text-gray-700">
              Invoice Number: {formatInvoiceNumber(invoice.id)}
            </div>
            <div className="text-sm text-gray-700">
              Date: {formatDate(invoice.client?.createdAt)}
            </div>
            <div className="text-sm text-gray-700">
              Due Date: {formatDate(invoice.client?.dueDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-900">Your Company</div>
            <div className="text-sm text-gray-700">
              Jl. Contoh No. 123
              <br />
              Jakarta 12345
              <br />
              Indonesia
            </div>
            <div className="text-sm text-blue-700 mt-1">
              hello@yourcompany.com
            </div>
          </div>
        </div>
        {/* Bill To */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>👤</span> Bill To:
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
            <span className="bg-blue-100 text-blue-600 rounded-full p-2 text-xl">
              👤
            </span>
            <div>
              <div className="font-bold text-blue-900">
                {invoice.client?.name}
              </div>
              <div className="text-gray-500 text-sm">
                {invoice.client?.email}
              </div>
            </div>
          </div>
        </div>
        {/* Items Table */}
        <div className="mb-6 overflow-x-auto">
          <div className="font-semibold text-gray-700 mb-2">Invoice Items</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg min-w-[500px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">ITEM</th>
                  <th className="px-3 py-2 text-center">QTY</th>
                  <th className="px-3 py-2 text-right">PRICE</th>
                  <th className="px-3 py-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item: InvoiceItem, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="bg-blue-50 rounded-lg p-4 min-w-[180px]">
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Subtotal:</span>
                <span>Rp {invoice.total?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-700 text-lg">
                <span>Total:</span>
                <span>Rp {invoice.total?.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Payment Info */}
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-gray-700 mb-2">
              Bank Transfer:
            </div>
            <div className="text-sm text-gray-700">Bank: BCA</div>
            <div className="text-sm text-gray-700">Account: 1234567890</div>
            <div className="text-sm text-gray-700">Name: Your Company</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-700 mb-2">
              Payment Details:
            </div>
            <div className="text-sm text-gray-700">
              Due Date: {formatDate(invoice.client?.dueDate)}
            </div>
            <div className="text-sm text-gray-700">
              Amount: Rp {invoice.total?.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg py-4 font-semibold">
          Thank you for your business!
          <br />
          <span className="text-sm font-normal">
            For any questions, please contact us at hello@yourcompany.com
          </span>
        </div>
      </div>
    </div>
  );
}
