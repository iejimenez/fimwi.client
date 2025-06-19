import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier, CreateSupplier, UpdateSupplier } from '../models/supplier.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getSuppliers(pageNumber = 0, pageSize = 10): Observable<PaginatedResponse<Supplier>> {
    return this.http.get<PaginatedResponse<Supplier>>(`${this.apiUrl}?pageNumber=${pageNumber + 1}&pageSize=${pageSize}`);
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: CreateSupplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: string, supplier: UpdateSupplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 