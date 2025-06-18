import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Batch } from '../../../core/models/product.model';
import { BatchFormComponent } from './batch-form.component';

@Component({
  selector: 'app-batch-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './batch-management.component.html',
  styleUrls: ['./batch-management.component.scss']
})
export class BatchManagementComponent implements OnInit {
  product: Product | null = null;
  batches: Batch[] = [];
  displayedColumns: string[] = [
    'batchNumber',
    'quantity',
    'purchasePrice',
    'manufacturingDate',
    'expirationDate',
    'status',
    'actions'
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
      this.loadBatches(productId);
    } else {
      this.router.navigate(['/inventory/products']);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
      },
      error: (error: Error) => {
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
        console.error('Error loading product:', error);
        this.router.navigate(['/inventory/products']);
      }
    });
  }

  private loadBatches(productId: string): void {
    this.productService.getBatches(productId).subscribe({
      next: (batches: Batch[]) => {
        this.batches = batches;
      },
      error: (error: Error) => {
        this.snackBar.open('Error al cargar los lotes', 'Cerrar', { duration: 3000 });
        console.error('Error loading batches:', error);
      }
    });
  }

  onAddBatch(): void {
    if (!this.product) return;

    const dialogRef = this.dialog.open(BatchFormComponent, {
      width: '600px',
      data: { productId: this.product.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBatches(this.product!.id);
      }
    });
  }

  onEditBatch(batch: Batch): void {
    const dialogRef = this.dialog.open(BatchFormComponent, {
      width: '600px',
      data: { productId: this.product!.id, batch }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBatches(this.product!.id);
      }
    });
  }

  onDeleteBatch(batch: Batch): void {
    if (confirm(`¿Está seguro de eliminar el lote ${batch.batchNumber}?`)) {
      this.productService.deleteBatch(this.product!.id, batch.id).subscribe({
        next: () => {
          this.snackBar.open('Lote eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadBatches(this.product!.id);
        },
        error: (error: Error) => {
          this.snackBar.open('Error al eliminar el lote', 'Cerrar', { duration: 3000 });
          console.error('Error deleting batch:', error);
        }
      });
    }
  }
} 