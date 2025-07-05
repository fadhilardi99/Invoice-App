import React from "react";

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

interface InvoiceItemsFormProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({
  items,
  onChange,
  onAddItem,
  onRemoveItem,
}) => {
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updated = items.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "name" ? value : Number(value) }
        : item
    );
    onChange(updated);
  };

  return (
    <div className="bg-green-50 rounded-lg shadow p-6 mb-4">
      <div className="font-semibold text-green-900 mb-4 flex items-center gap-2">
        <span className="text-lg">💲</span> Invoice Items
        <button
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded flex items-center gap-1 text-sm font-semibold"
          type="button"
          onClick={onAddItem}
        >
          + Add Item
        </button>
      </div>
      {items.length === 0 && (
        <div className="text-gray-400 text-center py-4">
          No items. Add your first item.
        </div>
      )}
      {items.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-2"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Item Name"
            value={item.name}
            onChange={(e) => handleItemChange(idx, "name", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Quantity"
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Price (IDR)"
            type="number"
            min={0}
            value={item.price}
            onChange={(e) => handleItemChange(idx, "price", e.target.value)}
          />
          <div className="text-green-700 font-bold">
            Rp {(item.quantity * item.price).toLocaleString("id-ID")}
          </div>
          <button
            className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
            type="button"
            onClick={() => onRemoveItem(idx)}
            title="Remove Item"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export type { InvoiceItem };
export default InvoiceItemsForm;
