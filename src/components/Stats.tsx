import React from "react";

interface StatsProps {
  totalRevenue: string;
  totalInvoices: number;
  paidInvoices: { count: number; amount: string };
  overdue: { count: number; note: string };
}

const Stats: React.FC<StatsProps> = ({
  totalRevenue,
  totalInvoices,
  paidInvoices,
  overdue,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-8">
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Total Revenue</span>
      <span className="text-2xl font-bold text-green-600">{totalRevenue}</span>
    </div>
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Total Invoices</span>
      <span className="text-2xl font-bold text-blue-600">{totalInvoices}</span>
    </div>
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Paid Invoices</span>
      <span className="text-2xl font-bold text-green-600">
        {paidInvoices.count}
      </span>
      <span className="text-xs text-green-700">{paidInvoices.amount}</span>
    </div>
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Overdue</span>
      <span className="text-2xl font-bold text-red-500">{overdue.count}</span>
      <span className="text-xs text-red-600">{overdue.note}</span>
    </div>
  </div>
);

export default Stats;
