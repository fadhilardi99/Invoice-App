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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
          type="button"
          onClick={onAddItem}
        >
          <span>+</span>
          <span>Add Item</span>
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">📦</div>
          <div className="text-gray-500">No items added yet</div>
          <div className="text-gray-400 text-sm">
            Click &quot;Add Item&quot; to get started
          </div>
        </div>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Item Name
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="Enter item name"
                value={item.name}
                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Quantity
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="Qty"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Price (IDR)
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                placeholder="0"
                type="number"
                min={0}
                value={item.price}
                onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              />
            </div>
            <div className="text-center">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Total
              </label>
              <div className="text-green-700 font-bold text-lg">
                Rp {(item.quantity * item.price).toLocaleString("id-ID")}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="text-red-500 hover:text-red-700 font-bold text-xl px-3 py-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                type="button"
                onClick={() => onRemoveItem(idx)}
                title="Remove Item"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export type { InvoiceItem };
export default InvoiceItemsForm;
