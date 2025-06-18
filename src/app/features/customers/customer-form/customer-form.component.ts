import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  documentTypes = ['CC', 'CE', 'TI', 'NIT'];
  isEditMode = false;
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerId = id;
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: string): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.snackBar.open('Error al cargar el cliente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      
      if (this.isEditMode && this.customerId) {
        this.customerService.updateCustomer(this.customerId, customerData).subscribe({
          next: () => {
            this.snackBar.open('Cliente actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            console.error('Error updating customer:', error);
            this.snackBar.open('Error al actualizar el cliente', 'Cerrar', {
              duration: 3000
            });
          }
        });
      } else {
        this.customerService.createCustomer(customerData).subscribe({
          next: () => {
            this.snackBar.open('Cliente creado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/customers']);
          },
          error: (error) => {
            console.error('Error creating customer:', error);
            this.snackBar.open('Error al crear el cliente', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
} 