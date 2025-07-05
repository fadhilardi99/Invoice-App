import React from "react";

interface StatsProps {
  totalRevenue: string;
  totalInvoices: number;
  paidInvoices: {
    count: number;
    amount: string;
  };
  overdue: {
    count: number;
    note: string;
  };
}

const Stats: React.FC<StatsProps> = ({
  totalRevenue,
  totalInvoices,
  paidInvoices,
  overdue,
}) => {
  const stats = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: "💰",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      icon: "📄",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Paid Invoices",
      value: `${paidInvoices.count} invoices`,
      subtitle: `Rp ${paidInvoices.amount}`,
      icon: "✅",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      title: "Overdue",
      value: `${overdue.count} invoices`,
      subtitle: overdue.note,
      icon: "⚠️",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}
              >
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div
                className={`w-3 h-3 bg-gradient-to-br ${stat.color} rounded-full`}
              ></div>
            </div>

            <div className="space-y-2">
              <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                {stat.title}
              </h3>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-gray-500 text-sm">{stat.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
