import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier, CreateSupplier, UpdateSupplier, DocumentType } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  documentTypes: DocumentType[] = ['CC', 'CE', 'TI', 'NIT'];
  isEditMode = false;
  supplierId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier?: Supplier }
  ) {
    this.supplierForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.supplier) {
      this.isEditMode = true;
      this.supplierId = this.data.supplier.id;
      this.supplierForm.patchValue(this.data.supplier);
    }
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      if (this.isEditMode && this.supplierId) {
        this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
          next: () => {
            this.snackBar.open('Proveedor actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar el proveedor', 'Cerrar', { duration: 3000 });
            console.error('Error updating supplier:', error);
          }
        });
      } else {
        this.supplierService.createSupplier(supplierData).subscribe({
          next: () => {
            this.snackBar.open('Proveedor creado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al crear el proveedor', 'Cerrar', { duration: 3000 });
            console.error('Error creating supplier:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 