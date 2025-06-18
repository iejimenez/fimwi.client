export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  minStock?: number;
  maxStock?: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface Batch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  purchasePrice: number;
  manufacturingDate: Date;
  expirationDate: Date;
  status: BatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum BatchStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DEPLETED = 'depleted'
} 