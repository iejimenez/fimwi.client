import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Customer } from '../../../core/models/customer.model';
import { Product } from '../../../core/models/product.model';
import { Invoice } from '../../../core/models/invoice.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  customers: Customer[] = [];
  products: Product[] = [];
  isEditMode = false;
  invoiceId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {
    this.invoiceForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      invoiceNumber: ['', Validators.required],
      status: ['draft', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.invoiceId = id;
      this.loadInvoice(id);
    } else {
      this.addItem();
    }
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  private loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response: PaginatedResponse<Customer>) => {
        this.customers = response.data;
      },
      error: (error: Error) => {
        console.error('Error loading customers:', error);
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.products = response.data;
      },
      error: (error: Error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error al cargar los productos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private loadInvoice(id: string): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: (invoice: Invoice) => {
        this.invoiceForm.patchValue({
          customerId: invoice.customerId,
          date: new Date(invoice.date),
          invoiceNumber: invoice.invoiceNumber,
          status: invoice.status
        });

        invoice.items.forEach(item => {
          this.items.push(this.fb.group({
            productId: [item.productId, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]]
          }));
        });
      },
      error: (error: Error) => {
        console.error('Error loading invoice:', error);
        this.snackBar.open('Error al cargar la factura', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/invoices']);
      }
    });
  }

  addItem(): void {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      return total + (quantity * unitPrice);
    }, 0);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const invoiceData = {
        ...this.invoiceForm.value,
        items: this.invoiceForm.value.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      if (this.isEditMode && this.invoiceId) {
        this.invoiceService.updateInvoice(this.invoiceId, invoiceData).subscribe({
          next: () => {
            this.snackBar.open('Factura actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/invoices']);
          },
          error: (error: Error) => {
            console.error('Error updating invoice:', error);
            this.snackBar.open('Error al actualizar la factura', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.invoiceService.createInvoice(invoiceData).subscribe({
          next: () => {
            this.snackBar.open('Factura creada exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/invoices']);
          },
          error: (error: Error) => {
            console.error('Error creating invoice:', error);
            this.snackBar.open('Error al crear la factura', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/invoices']);
  }
} 