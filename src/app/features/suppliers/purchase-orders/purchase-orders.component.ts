import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { PurchaseOrder } from '../../../core/models/purchase-order.model';
import { Supplier } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent implements OnInit {
  supplier: Supplier | null = null;
  orders: PurchaseOrder[] = [];
  displayedColumns: string[] = ['orderNumber', 'date', 'status', 'total', 'actions'];

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const supplierId = this.route.snapshot.paramMap.get('id');
    if (supplierId) {
      this.loadSupplier(supplierId);
      this.loadOrders(supplierId);
    } else {
      this.router.navigate(['/suppliers']);
    }
  }

  loadSupplier(id: string): void {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier: Supplier) => {
        this.supplier = supplier;
      },
      error: (error: Error) => {
        this.snackBar.open('Error al cargar el proveedor', 'Cerrar', { duration: 3000 });
        console.error('Error loading supplier:', error);
        this.router.navigate(['/suppliers']);
      }
    });
  }

  loadOrders(supplierId: string): void {
    this.purchaseOrderService.getSupplierPurchaseOrders(supplierId).subscribe({
      next: (orders: PurchaseOrder[]) => {
        this.orders = orders;
      },
      error: (error: Error) => {
        this.snackBar.open('Error al cargar las órdenes', 'Cerrar', { duration: 3000 });
        console.error('Error loading orders:', error);
      }
    });
  }

  onAddOrder(): void {
    if (this.supplier) {
      this.router.navigate(['/suppliers', this.supplier.id, 'orders', 'new']);
    }
  }

  onEditOrder(order: PurchaseOrder): void {
    this.router.navigate(['/suppliers', this.supplier!.id, 'orders', order.id, 'edit']);
  }

  onViewOrder(order: PurchaseOrder): void {
    this.router.navigate(['/suppliers', this.supplier!.id, 'orders', order.id]);
  }

  onDeleteOrder(order: PurchaseOrder): void {
    if (confirm(`¿Está seguro de eliminar la orden ${order.orderNumber}?`)) {
      this.purchaseOrderService.deletePurchaseOrder(order.id).subscribe({
        next: () => {
          this.snackBar.open('Orden eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadOrders(this.supplier!.id);
        },
        error: (error: Error) => {
          this.snackBar.open('Error al eliminar la orden', 'Cerrar', { duration: 3000 });
          console.error('Error deleting order:', error);
        }
      });
    }
  }
} 