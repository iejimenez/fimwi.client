import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductDto, Batch, BatchStatus } from '../models/product.model';

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(this.apiUrl, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: string, quantity: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/stock`, { quantity });
  }

  // Batch operations
  getBatches(productId: string): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.apiUrl}/${productId}/batches`);
  }

  createBatch(productId: string, batch: Omit<Batch, 'id' | 'productId' | 'createdAt' | 'updatedAt'>): Observable<Batch> {
    return this.http.post<Batch>(`${this.apiUrl}/${productId}/batches`, batch);
  }

  updateBatch(productId: string, batchId: string, batch: Partial<Batch>): Observable<Batch> {
    return this.http.patch<Batch>(`${this.apiUrl}/${productId}/batches/${batchId}`, batch);
  }

  deleteBatch(productId: string, batchId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/batches/${batchId}`);
  }
} 