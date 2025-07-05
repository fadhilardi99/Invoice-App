import React from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";

interface InvoiceContentProps {
  invoice: Invoice;
  className?: string;
}

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

const InvoiceContent: React.FC<InvoiceContentProps> = ({
  invoice,
  className = "",
}) => {
  return (
    <div className={`bg-white p-8 md:p-12 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-6">
        <div>
          <div className="text-3xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-2xl mb-4 shadow-lg">
            INVOICE
          </div>
          <div className="space-y-2 text-gray-700">
            <div className="text-sm">
              <span className="font-semibold">Invoice Number:</span>{" "}
              {formatInvoiceNumber(invoice.id)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(invoice.client?.createdAt)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Due Date:</span>{" "}
              {formatDate(invoice.client?.dueDate)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PT. Elektronik Indonesia
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <div>Jl. Pakansari 33</div>
            <div>Cibinong</div>
            <div>Indonesia</div>
          </div>
          <div className="text-sm text-blue-700 mt-2 font-semibold">
            hello@elektronikindo.com
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <div className="font-semibold text-gray-800 mb-4 flex items-center gap-3 text-lg">
          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </span>
          Bill To:
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 border border-gray-200">
          <span className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-2xl">
            👤
          </span>
          <div>
            <div className="font-bold text-xl text-gray-800">
              {invoice.client?.name}
            </div>
            <div className="text-gray-600">{invoice.client?.email}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="font-semibold text-gray-800 mb-4 flex items-center gap-3 text-lg">
          <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📦</span>
          </span>
          Invoice Items
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-2 border-gray-200 rounded-2xl overflow-hidden min-w-[500px] shadow-lg">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">
                  ITEM
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-800">
                  QTY
                </th>
                <th className="px-6 py-4 text-right font-semibold text-gray-800">
                  PRICE
                </th>
                <th className="px-6 py-4 text-right font-semibold text-gray-800">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item: InvoiceItem, idx: number) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-700">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 min-w-[250px] border border-blue-200">
            <div className="flex justify-between text-gray-700 mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-semibold">
                Rp {invoice.total?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <span>Total:</span>
              <span>Rp {invoice.total?.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 flex flex-col md:flex-row gap-8 mb-6 border border-blue-200">
        <div className="flex-1">
          <div className="font-semibold text-gray-800 mb-4 text-lg">
            🏦 Bank Transfer:
          </div>
          <div className="space-y-2 text-gray-700">
            <div className="text-sm">
              <span className="font-semibold">Bank:</span> BCA
            </div>
            <div className="text-sm">
              <span className="font-semibold">Account:</span> 321098756
            </div>
            <div className="text-sm">
              <span className="font-semibold">Name:</span> PT. Elektronik
              Indonesia
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 mb-4 text-lg">
            💳 Payment Details:
          </div>
          <div className="space-y-2 text-gray-700">
            <div className="text-sm">
              <span className="font-semibold">Due Date:</span>{" "}
              {formatDate(invoice.client?.dueDate)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Amount:</span> Rp{" "}
              {invoice.total?.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl py-8 font-semibold shadow-lg">
        <div className="text-xl mb-2">Thank you for your business!</div>
        <div className="text-sm font-normal opacity-90">
          For any questions, please contact us at hello@elektronikindo.com
        </div>
      </div>
    </div>
  );
};

export default InvoiceContent;
