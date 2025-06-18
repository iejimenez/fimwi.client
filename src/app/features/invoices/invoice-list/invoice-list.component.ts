import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['invoiceNumber', 'date', 'customer', 'total', 'status', 'actions'];

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  private loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices: Invoice[]) => {
        this.invoices = invoices;
      },
      error: (error: Error) => {
        console.error('Error loading invoices:', error);
        this.snackBar.open('Error al cargar las facturas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  addInvoice(): void {
    this.router.navigate(['/invoices/new']);
  }

  editInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id, 'edit']);
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id]);
  }

  deleteInvoice(invoice: Invoice): void {
    if (confirm('¿Está seguro de eliminar esta factura?')) {
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.loadInvoices();
          this.snackBar.open('Factura eliminada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: (error: Error) => {
          console.error('Error deleting invoice:', error);
          this.snackBar.open('Error al eliminar la factura', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
} 