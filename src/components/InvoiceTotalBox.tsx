import React from "react";

interface InvoiceTotalBoxProps {
  total: number;
}

const InvoiceTotalBox: React.FC<InvoiceTotalBoxProps> = ({ total }) => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 min-w-[250px] border border-blue-200 shadow-lg">
    <div className="text-gray-600 text-sm mb-2 font-semibold">
      Invoice Total:
    </div>
    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Rp {total.toLocaleString("id-ID")}
    </div>
  </div>
);

export default InvoiceTotalBox;
