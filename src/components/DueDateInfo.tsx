import React from "react";

interface DueDateInfoProps {
  dueDate: string | Date;
  status: "paid" | "unpaid" | "overdue";
  total: number;
}

const DueDateInfo: React.FC<DueDateInfoProps> = ({
  dueDate,
  status,
  total,
}) => {
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "N/A";
    }
  };

  const getDaysRemaining = (dueDate: string | Date): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(dueDate);
  const isOverdue = daysRemaining < 0;
  const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;

  const getStatusColor = () => {
    if (status === "paid")
      return "text-green-600 bg-green-100 border-green-200";
    if (isOverdue) return "text-red-600 bg-red-100 border-red-200";
    if (isDueSoon) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-blue-600 bg-blue-100 border-blue-200";
  };

  const getStatusText = () => {
    if (status === "paid") return "✅ Paid";
    if (isOverdue) return "❌ Overdue";
    if (isDueSoon) return "⚠️ Due Soon";
    return "⏳ Unpaid";
  };

  const getDaysText = () => {
    if (status === "paid") return "Payment completed";
    if (isOverdue) return `${Math.abs(daysRemaining)} days overdue`;
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining === 1) return "Due tomorrow";
    return `${daysRemaining} days remaining`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span className="font-semibold text-gray-800">Due Date</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}
        >
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Due Date:</span>
          <span className="font-semibold text-gray-800">
            {formatDate(dueDate)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Status:</span>
          <span
            className={`text-sm font-semibold ${
              getStatusColor().split(" ")[0]
            }`}
          >
            {getDaysText()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Amount:</span>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {isOverdue && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm font-semibold">
            ⚠️ Payment Overdue
          </div>
          <div className="text-red-600 text-xs">
            Please contact the client for payment
          </div>
        </div>
      )}

      {isDueSoon && status !== "paid" && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-700 text-sm font-semibold">
            ⏰ Due Soon
          </div>
          <div className="text-yellow-600 text-xs">
            Consider sending a reminder
          </div>
        </div>
      )}
    </div>
  );
};

export default DueDateInfo;
