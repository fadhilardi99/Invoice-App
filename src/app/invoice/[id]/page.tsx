"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Invoice, InvoiceItem, ClientInfo } from "@/types/invoice";
import Spinner from "@/components/Spinner";
import DueDateInfo from "@/components/DueDateInfo";
import InvoiceContent from "@/components/InvoiceContent";

// Helper function to format dates
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }

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
  if (invoiceId.startsWith("INVOICE-")) {
    const parts = invoiceId.split("-");
    if (parts.length >= 3) {
      const clientName = parts.slice(1, -1).join("-");
      return `INVOICE - ${clientName}`;
    }
  }
  return invoiceId;
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const decodedId = typeof id === "string" ? decodeURIComponent(id) : id;
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
    console.log("Fetching invoice with ID:", decodedId);
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched invoices:", data);
        if (data.success) {
          const found = data.invoices.find(
            (inv: Invoice) => inv.id === decodedId
          );
          console.log("Found invoice:", found);
          if (found) {
            setInvoice(found);
            setError(null);
          } else {
            console.error("Invoice not found for ID:", decodedId);
            console.log(
              "Available invoices:",
              data.invoices.map((inv: Invoice) => inv.id)
            );
            setError("Invoice not found");
          }
        } else {
          console.error("Failed to fetch invoices:", data);
          setError("Failed to fetch invoice");
        }
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        setError("Failed to fetch invoice");
      })
      .finally(() => setLoading(false));
  }, [decodedId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      console.log("Deleting invoice:", decodedId);
      const res = await fetch(`/api/invoices/${decodedId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Delete response:", data);
      if (data.success) {
        toast.success("✅ Invoice deleted successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        console.error("Delete failed:", data);
        setDeleteError(
          `❌ Failed to delete invoice: ${data.error || "Unknown error"}`
        );
        toast.error(
          `❌ Failed to delete invoice: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("❌ Failed to delete invoice: Network error");
      toast.error("❌ Failed to delete invoice: Network error");
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
      const res = await fetch(`/api/invoices/${decodedId}`, {
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
        toast.success("✅ Invoice updated successfully!");
      } else {
        setEditError(
          `❌ Failed to update invoice: ${data.error || "Unknown error"}`
        );
        toast.error(
          `❌ Failed to update invoice: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Edit error:", error);
      setEditError("❌ Failed to update invoice: Network error");
      toast.error("❌ Failed to update invoice: Network error");
    } finally {
      setEditLoading(false);
    }
  };

  const handlePrint = () => {
    if (!invoice) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${formatInvoiceNumber(invoice.id)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px; }
              .invoice-title { font-size: 32px; font-weight: bold; color: #0066cc; margin-bottom: 10px; }
              .invoice-info { font-size: 14px; margin-bottom: 5px; color: #333; }
              .company-info { text-align: right; }
              .company-name { font-size: 24px; font-weight: bold; color: #0066cc; margin-bottom: 5px; }
              .bill-to { margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 10px; }
              .bill-to h3 { margin: 0 0 15px 0; color: #333; font-size: 16px; }
              .client-name { font-size: 18px; font-weight: bold; color: #000; }
              .client-email { color: #666; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
              th { padding: 12px; text-align: left; font-weight: bold; color: #333; border-bottom: 2px solid #ccc; background: #e0e0e0; }
              td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .total-section { text-align: right; margin: 20px 0; padding: 20px; background: #e6f3ff; border-radius: 10px; }
              .subtotal { font-size: 14px; margin-bottom: 5px; color: #333; }
              .total { font-size: 24px; font-weight: bold; color: #0066cc; }
              .payment-info { display: flex; justify-content: space-between; margin: 30px 0; padding: 20px; background: #f0f8ff; border-radius: 10px; }
              .payment-section h4 { margin: 0 0 10px 0; font-size: 16px; color: #333; }
              .payment-section div { font-size: 14px; margin-bottom: 2px; color: #333; }
              .footer { text-align: center; margin-top: 40px; padding: 20px; background: #0066cc; color: #fff; border-radius: 10px; }
              .footer-title { font-size: 20px; margin-bottom: 10px; }
              .footer-text { font-size: 14px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="header">
                <div>
                  <div class="invoice-title">INVOICE</div>
                  <div class="invoice-info">Invoice Number: ${formatInvoiceNumber(
                    invoice.id
                  )}</div>
                  <div class="invoice-info">Date: ${formatDate(
                    invoice.client?.createdAt
                  )}</div>
                  <div class="invoice-info">Due Date: ${formatDate(
                    invoice.client?.dueDate
                  )}</div>
                </div>
                <div class="company-info">
                  <div class="company-name">PT. Elektronik Indonesia</div>
                  <div class="invoice-info">Jl. Pakansari 33</div>
                  <div class="invoice-info">Cibinong</div>
                  <div class="invoice-info">Indonesia</div>
                  <div class="invoice-info">hello@elektronikindo.com</div>
                </div>
              </div>
              
              <div class="bill-to">
                <h3>Bill To:</h3>
                <div class="client-name">${invoice.client?.name || "N/A"}</div>
                <div class="client-email">${
                  invoice.client?.email || "N/A"
                }</div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th class="text-center">QTY</th>
                    <th class="text-right">PRICE</th>
                    <th class="text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    invoice.items
                      ?.map(
                        (item: InvoiceItem) => `
                    <tr>
                      <td>${item.name || "N/A"}</td>
                      <td class="text-center">${item.quantity || 0}</td>
                      <td class="text-right">Rp ${(
                        item.price || 0
                      ).toLocaleString("id-ID")}</td>
                      <td class="text-right font-bold">Rp ${(
                        (item.quantity || 0) * (item.price || 0)
                      ).toLocaleString("id-ID")}</td>
                    </tr>
                  `
                      )
                      .join("") ||
                    '<tr><td colspan="4" class="text-center" style="padding: 20px; color: #666;">No items</td></tr>'
                  }
                </tbody>
              </table>
              
              <div class="total-section">
                <div class="subtotal">Subtotal: Rp ${(
                  invoice.total || 0
                ).toLocaleString("id-ID")}</div>
                <div class="total">Total: Rp ${(
                  invoice.total || 0
                ).toLocaleString("id-ID")}</div>
              </div>
              
              <div class="payment-info">
                <div class="payment-section">
                  <h4>🏦 Bank Transfer:</h4>
                  <div>Bank: BCA</div>
                  <div>Account: 321098756</div>
                  <div>Name: PT. Elektronik Indonesia</div>
                </div>
                <div class="payment-section">
                  <h4>💳 Payment Details:</h4>
                  <div>Due Date: ${formatDate(invoice.client?.dueDate)}</div>
                  <div>Amount: Rp ${(invoice.total || 0).toLocaleString(
                    "id-ID"
                  )}</div>
                </div>
              </div>
              
              <div class="footer">
                <div class="footer-title">Thank you for your business!</div>
                <div class="footer-text">For any questions, please contact us at hello@elektronikindo.com</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleSendEmail = async () => {
    if (!invoice) return;

    setEmailLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: invoice.client?.email,
          subject: `Invoice ${formatInvoiceNumber(
            invoice.id
          )} - PT. Elektronik Indonesia`,
          invoiceId: invoice.id,
          invoiceData: invoice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `✅ Invoice sent successfully to ${invoice.client?.email}!`,
          { duration: 4000 }
        );
      } else {
        toast.error(
          `❌ Failed to send email: ${data.error || "Unknown error"}`,
          { duration: 4000 }
        );
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("❌ Failed to send email. Please try again.", {
        duration: 4000,
      });
    } finally {
      setEmailLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                <span className="text-2xl">←</span>
                <span>Back to Dashboard</span>
              </Link>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatInvoiceNumber(invoice.id)}
                  </div>
                  <div className="text-sm text-gray-500">Invoice Number</div>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : invoice.status === "overdue"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {invoice.status
                    ? invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 text-sm">
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(invoice.client?.createdAt)}
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {emailLoading ? "📧 Sending..." : "📧 Send Email"}
                </button>
                <button
                  onClick={startEdit}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  {deleteLoading ? "🗑️ Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {deleteError && (
          <div className="w-full max-w-6xl mx-auto px-4 mb-6">
            <div className="bg-red-100 border border-red-200 rounded-2xl p-4 text-center text-red-700 font-semibold shadow-lg">
              {deleteError}
            </div>
          </div>
        )}

        {editMode && (
          <div className="w-full max-w-6xl mx-auto px-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✏️</span>
                </span>
                Edit Invoice
              </h2>

              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Client Name"
                    value={editData!.client.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Client Email"
                    value={editData!.client.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                  />
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Due Date"
                    type="date"
                    value={editData!.client.dueDate}
                    onChange={(e) =>
                      handleEditChange("dueDate", e.target.value)
                    }
                  />
                </div>

                {(editErrors.name ||
                  editErrors.email ||
                  editErrors.dueDate) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {[editErrors.name, editErrors.email, editErrors.dueDate]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                )}

                <div className="mb-6">
                  <select
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300 w-full md:w-auto"
                    value={editData!.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="mb-6">
                  <div className="font-semibold mb-4 text-gray-800">
                    Invoice Items
                  </div>
                  {editData!.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-center"
                    >
                      <input
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) =>
                          handleEditItemChange(idx, "name", e.target.value)
                        }
                      />
                      <input
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                        placeholder="Quantity"
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleEditItemChange(idx, "quantity", e.target.value)
                        }
                      />
                      <input
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                        placeholder="Price (IDR)"
                        type="number"
                        min={0}
                        value={item.price}
                        onChange={(e) =>
                          handleEditItemChange(idx, "price", e.target.value)
                        }
                      />
                      <div className="text-green-700 font-bold text-center">
                        Rp{" "}
                        {(item.quantity * item.price).toLocaleString("id-ID")}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditItem(idx)}
                        className="text-red-500 hover:text-red-700 font-bold text-xl px-3 py-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {editErrors.items && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                      {editErrors.items}
                    </div>
                  )}

                  {editData!.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs"
                    >
                      {[
                        editErrors[`item-name-${idx}`],
                        editErrors[`item-qty-${idx}`],
                        editErrors[`item-price-${idx}`],
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddEditItem}
                    className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="mb-6 flex justify-end">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 min-w-[200px] text-right border border-blue-200">
                    <div className="text-gray-600 text-sm mb-1">
                      Invoice Total:
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Rp {editTotal.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {editError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {editError}
                  </div>
                )}

                <div className="flex gap-4 justify-end flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading || !isEditValid}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      editLoading || !isEditValid
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl"
                    }`}
                  >
                    {editLoading ? "💾 Saving..." : "💾 Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Due Date Info */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-6">
          <DueDateInfo
            dueDate={invoice.client?.dueDate || ""}
            status={invoice.status || "unpaid"}
            total={invoice.total || 0}
          />
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="w-full max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
            <InvoiceContent invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
