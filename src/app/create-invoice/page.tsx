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
          setNotif("Invoice created successfully!");
          setTimeout(() => {
            router.push("/");
          }, 1200);
        } else {
          console.error("API Error:", data);
          setNotif(
            `Failed to create invoice: ${data.error || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Network Error:", error);
        setNotif("Failed to create invoice: Network error");
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
    <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 flex flex-col items-center font-sans">
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-4 px-1 sm:px-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium"
        >
          <span className="text-xl">←</span> Back to Dashboard
        </Link>
      </div>
      {/* Header */}
      <div className="flex flex-col items-center mb-8 px-2 sm:px-0">
        <div className="bg-blue-600 rounded-full p-4 mb-4">
          <span className="text-white text-3xl">📄</span>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">
          Create New Invoice
        </h1>
        <p className="text-gray-600 text-center max-w-xl mb-4">
          Fill in the details to generate your invoice
        </p>
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Notif */}
        {notif && (
          <div
            className={`w-full max-w-4xl mb-4 text-center rounded py-2 font-semibold ${
              notif.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notif}
          </div>
        )}
        {/* Client Info Form */}
        <div className="w-full max-w-4xl mb-6 px-1 sm:px-0 mx-auto">
          <ClientInfoForm value={clientInfo} onChange={setClientInfo} />
          {(errors.name || errors.email || errors.dueDate) && (
            <div className="text-red-500 text-sm mt-1">
              {[errors.name, errors.email, errors.dueDate]
                .filter(Boolean)
                .join(" | ")}
            </div>
          )}
        </div>
        {/* Invoice Items Form */}
        <div className="w-full max-w-4xl mx-auto mb-6 px-1 sm:px-0">
          <InvoiceItemsForm
            items={invoiceItems}
            onChange={setInvoiceItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
          {errors.items && (
            <div className="text-red-500 text-sm mt-1">{errors.items}</div>
          )}
          {invoiceItems.map((item, idx) => (
            <div key={idx} className="text-red-500 text-xs">
              {[
                errors[`item-name-${idx}`],
                errors[`item-qty-${idx}`],
                errors[`item-price-${idx}`],
              ]
                .filter(Boolean)
                .join(" | ")}
            </div>
          ))}
        </div>
        {/* Invoice Total Box */}
        <div className="w-full max-w-4xl mx-auto flex justify-end mb-8 px-1 sm:px-0">
          <InvoiceTotalBox total={invoiceTotal} />
        </div>
        {/* Action Buttons */}
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-end gap-4 px-1 sm:px-0">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 rounded border border-gray-300 bg-white text-gray-700 font-semibold w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`px-6 py-2 rounded flex items-center gap-2 font-semibold w-full sm:w-auto ${
              isValid && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="text-lg">📄</span>{" "}
            {loading ? "Saving..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
