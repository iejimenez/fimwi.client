import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.supplierForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      taxId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.supplierId;

    if (this.isEditMode && this.supplierId) {
      this.loadSupplier(this.supplierId);
    }
  }

  loadSupplier(id: string): void {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier: Supplier) => {
        this.supplierForm.patchValue(supplier);
      },
      error: (error: Error) => {
        this.snackBar.open('Error al cargar el proveedor', 'Cerrar', { duration: 3000 });
        console.error('Error loading supplier:', error);
        this.router.navigate(['/suppliers']);
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;

      if (this.isEditMode && this.supplierId) {
        this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
          next: () => {
            this.snackBar.open('Proveedor actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/suppliers']);
          },
          error: (error: Error) => {
            this.snackBar.open('Error al actualizar el proveedor', 'Cerrar', { duration: 3000 });
            console.error('Error updating supplier:', error);
          }
        });
      } else {
        this.supplierService.createSupplier(supplierData).subscribe({
          next: () => {
            this.snackBar.open('Proveedor creado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/suppliers']);
          },
          error: (error: Error) => {
            this.snackBar.open('Error al crear el proveedor', 'Cerrar', { duration: 3000 });
            console.error('Error creating supplier:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }
} 