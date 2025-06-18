import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Supplier } from '../../../core/models/supplier.model';
import { SupplierService } from '../../../core/services/supplier.service';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

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
    HttpClientModule,
    RouterModule,
    ConfirmDialogComponent
  ]
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['code', 'name', 'contact', 'email', 'phone', 'actions'];

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
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.snackBar.open('Error al cargar los proveedores', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onAddSupplier(): void {
    this.router.navigate(['/suppliers/new']);
  }

  onEditSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'edit']);
  }

  onViewOrders(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'orders']);
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
          }
        });
      }
    });
  }
} 