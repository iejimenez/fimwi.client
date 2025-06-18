export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerId: string;
  customerName: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  items: InvoiceItem[];
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled'; 