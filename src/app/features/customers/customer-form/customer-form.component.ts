import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
    MatSnackBarModule,
    MatDialogModule
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
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer?: Customer }
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
    if (this.data?.customer) {
      this.isEditMode = true;
      this.customerId = this.data.customer.id;
      this.customerForm.patchValue(this.data.customer);
    }
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
            this.dialogRef.close(true);
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
            this.dialogRef.close(true);
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
    this.dialogRef.close();
  }
} 