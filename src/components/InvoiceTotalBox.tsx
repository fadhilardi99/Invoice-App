import React from "react";

interface InvoiceTotalBoxProps {
  total: number;
}

const InvoiceTotalBox: React.FC<InvoiceTotalBoxProps> = ({ total }) => (
  <div className="bg-blue-50 rounded-lg shadow p-6 min-w-[220px] flex flex-col items-end">
    <div className="text-gray-500 text-sm mb-1">Invoice Total:</div>
    <div className="text-2xl font-bold text-blue-700">
      Rp {total.toLocaleString("id-ID")}
    </div>
  </div>
);

export default InvoiceTotalBox;
