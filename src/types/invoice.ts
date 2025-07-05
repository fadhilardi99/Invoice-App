export interface ClientInfo {
  name: string;
  email: string;
  dueDate: string;
  createdAt?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  client: ClientInfo;
  status: "paid" | "unpaid" | "overdue";
  items: InvoiceItem[];
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
  invoices?: T[];
  invoice?: T;
}
