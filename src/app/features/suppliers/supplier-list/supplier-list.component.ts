import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Supplier } from '../../../core/models/supplier.model';
import { SupplierService } from '../../../core/services/supplier.service';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule,
    ConfirmDialogComponent
  ]
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['code', 'name', 'contact', 'email', 'phone', 'actions'];
  pageSize = 10;
  pageIndex = 0;
  totalRecords = 0;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getSuppliers(this.pageIndex, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Supplier>) => {
        this.suppliers = response.data;
        this.totalRecords = response.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.snackBar.open('Error al cargar los proveedores', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSuppliers();
  }

  onAddSupplier(): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  onEditSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: { supplier }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  onViewOrders(supplier: Supplier): void {
    // Mantener la navegación a órdenes
    // this.router.navigate(['/suppliers', supplier.id, 'orders']);
  }

  onDeleteSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Proveedor',
        message: `¿Está seguro que desea eliminar el proveedor ${supplier.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.supplierService.deleteSupplier(supplier.id).subscribe({
          next: () => {
            this.snackBar.open('Proveedor eliminado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadSuppliers();
          },
          error: (error) => {
            console.error('Error deleting supplier:', error);
            this.snackBar.open('Error al eliminar el proveedor', 'Cerrar', {
              duration: 3000
            });
            this.isLoading = false;
          }
        });
      }
    });
  }
} 