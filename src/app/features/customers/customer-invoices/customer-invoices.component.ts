import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { CustomerService } from '../../../core/services/customer.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Customer } from '../../../core/models/customer.model';
import { Invoice } from '../../../core/models/invoice.model';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-invoices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './customer-invoices.component.html',
  styleUrls: ['./customer-invoices.component.scss']
})
export class CustomerInvoicesComponent implements OnInit {
  customer: Customer | null = null;
  invoices: Invoice[] = [];
  displayedColumns: string[] = ['invoiceNumber', 'date', 'total', 'status', 'actions'];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.loadCustomer(customerId);
      this.loadInvoices(customerId);
    }
  }

  loadCustomer(customerId: string): void {
    this.isLoading = true;
    this.customerService.getCustomer(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.snackBar.open('Error al cargar el cliente', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  loadInvoices(customerId: string): void {
    this.isLoading = true;
    this.invoiceService.getCustomerInvoices(customerId).subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.snackBar.open('Error al cargar las facturas', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  addInvoice(): void {
    if (this.customer) {
      this.router.navigate(['/customers', this.customer.id, 'invoices', 'new']);
    }
  }

  editInvoice(invoice: Invoice): void {
    this.router.navigate(['/customers', this.customer?.id, 'invoices', invoice.id, 'edit']);
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/customers', this.customer?.id, 'invoices', invoice.id]);
  }

  deleteInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Factura',
        message: `¿Está seguro que desea eliminar la factura ${invoice.invoiceNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.invoiceService.deleteInvoice(invoice.id).subscribe({
          next: () => {
            this.snackBar.open('Factura eliminada exitosamente', 'Cerrar', {
              duration: 3000
            });
            if (this.customer) {
              this.loadInvoices(this.customer.id);
            }
          },
          error: (error) => {
            console.error('Error deleting invoice:', error);
            this.snackBar.open('Error al eliminar la factura', 'Cerrar', {
              duration: 3000
            });
            this.isLoading = false;
          }
        });
      }
    });
  }
} 