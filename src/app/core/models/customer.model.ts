export type DocumentType = 'CC' | 'CE' | 'TI' | 'NIT';

export interface Customer {
  id: string;
  name: string;
  documentNumber: string;
  documentType: DocumentType;
  address?: string;
  phone?: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomer {
  name: string;
  documentNumber: string;
  documentType: DocumentType;
  address?: string;
  phone?: string;
  email: string;
}

export interface UpdateCustomer {
  name: string;
  documentNumber: string;
  documentType: DocumentType;
  address?: string;
  phone?: string;
  email: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchId?: string;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
} 