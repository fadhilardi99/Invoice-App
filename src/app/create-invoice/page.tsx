"use client";
import Link from "next/link";
import React from "react";
import ClientInfoForm, { ClientInfo } from "../../components/ClientInfoForm";
import InvoiceItemsForm, {
  InvoiceItem,
} from "../../components/InvoiceItemsForm";
import InvoiceTotalBox from "../../components/InvoiceTotalBox";
import { useRouter } from "next/navigation";

export default function CreateInvoicePage() {
  const [clientInfo, setClientInfo] = React.useState<ClientInfo>({
    name: "",
    email: "",
    dueDate: "",
  });
  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceItem[]>([]);
  const handleAddItem = () =>
    setInvoiceItems([...invoiceItems, { name: "", quantity: 1, price: 0 }]);
  const handleRemoveItem = (idx: number) =>
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  const invoiceTotal = invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = React.useState(false);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [notif, setNotif] = React.useState<string | null>(null);

  const validate = React.useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!clientInfo.name) newErrors.name = "Client name is required";
    if (!clientInfo.email) newErrors.email = "Client email is required";
    if (!clientInfo.dueDate) newErrors.dueDate = "Due date is required";
    if (invoiceItems.length === 0) newErrors.items = "At least 1 item required";
    invoiceItems.forEach((item, idx) => {
      if (!item.name) newErrors[`item-name-${idx}`] = "Item name required";
      if (item.quantity <= 0)
        newErrors[`item-qty-${idx}`] = "Quantity must be > 0";
      if (item.price < 0) newErrors[`item-price-${idx}`] = "Price must be ≥ 0";
    });
    return newErrors;
  }, [clientInfo, invoiceItems]);

  const isValid = Object.keys(validate()).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      setNotif(null);
      try {
        const res = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: clientInfo,
            items: invoiceItems,
            total: invoiceTotal,
            status: "unpaid", // Default status for new invoices
          }),
        });
        const data = await res.json();
        if (data.success) {
          setNotif("✅ Invoice created successfully!");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          console.error("API Error:", data);
          setNotif(
            `❌ Failed to create invoice: ${data.error || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Network Error:", error);
        setNotif("❌ Failed to create invoice: Network error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setClientInfo({ name: "", email: "", dueDate: "" });
    setInvoiceItems([]);
    setSubmitted(false);
    setErrors({});
  };

  // Validasi real-time
  React.useEffect(() => {
    if (!submitted) return;
    setErrors(validate());
  }, [submitted, validate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto">
        {/* Back Button */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-300"
          >
            <span className="text-2xl">←</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <span className="text-white text-3xl">📄</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Create New Invoice
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Fill in the details below to generate your professional invoice
            </p>
          </div>
        </div>

        <form className="w-full max-w-6xl mx-auto px-4" onSubmit={handleSubmit}>
          {/* Notification */}
          {notif && (
            <div className="mb-6">
              <div
                className={`rounded-2xl p-4 text-center font-semibold shadow-lg ${
                  notif.includes("✅")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {notif}
              </div>
            </div>
          )}

          {/* Client Info Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </span>
              Client Information
            </h2>
            <ClientInfoForm value={clientInfo} onChange={setClientInfo} />
            {(errors.name || errors.email || errors.dueDate) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {[errors.name, errors.email, errors.dueDate]
                  .filter(Boolean)
                  .join(" • ")}
              </div>
            )}
          </div>

          {/* Invoice Items Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📦</span>
              </span>
              Invoice Items
            </h2>
            <InvoiceItemsForm
              items={invoiceItems}
              onChange={setInvoiceItems}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />
            {errors.items && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {errors.items}
              </div>
            )}
            {invoiceItems.map((item, idx) => (
              <div
                key={idx}
                className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs"
              >
                {[
                  errors[`item-name-${idx}`],
                  errors[`item-qty-${idx}`],
                  errors[`item-price-${idx}`],
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </div>
            ))}
          </div>

          {/* Invoice Total Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            <div className="flex justify-end">
              <InvoiceTotalBox total={invoiceTotal} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 rounded-2xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isValid && !loading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="text-xl">📄</span>
              <span>{loading ? "Creating..." : "Create Invoice"}</span>
              {!loading && isValid && <span className="text-sm">→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
