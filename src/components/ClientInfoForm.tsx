import React from "react";

type ClientInfo = {
  name: string;
  email: string;
  dueDate: string;
};

interface ClientInfoFormProps {
  value: ClientInfo;
  onChange: (value: ClientInfo) => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Client Name
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
            placeholder="Enter client name"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Client Email
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
            placeholder="Enter client email"
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Due Date
        </label>
        <input
          className="w-full md:w-1/2 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
          placeholder="Select due date"
          type="date"
          value={value.dueDate}
          onChange={(e) => onChange({ ...value, dueDate: e.target.value })}
        />
      </div>
    </div>
  );
};

export type { ClientInfo };
export default ClientInfoForm;
