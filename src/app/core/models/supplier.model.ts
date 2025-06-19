export type DocumentType = 'CC' | 'CE' | 'TI' | 'NIT';

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
}

export type SupplierStatus = 'active' | 'inactive';

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateSupplier {
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
}

export interface UpdateSupplier {
  code: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
} 