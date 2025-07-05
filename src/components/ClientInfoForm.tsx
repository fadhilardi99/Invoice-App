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
    <div className="bg-blue-50 rounded-lg shadow p-6 mb-4">
      <div className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <span className="text-lg">👤</span> Client Information
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Client Name"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Client Email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <input
          className="border rounded px-3 py-2 w-full md:w-1/2"
          placeholder="Due Date"
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
