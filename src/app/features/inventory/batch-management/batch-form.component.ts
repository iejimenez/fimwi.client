import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { Batch } from '../../../core/models/product.model';

interface DialogData {
  productId: string;
  batch?: Batch;
}

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.batch ? 'Edit' : 'Create'}} Batch</h2>
    <form [formGroup]="batchForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Batch Number</mat-label>
          <input matInput formControlName="batchNumber" placeholder="Enter batch number">
          <mat-error *ngIf="batchForm.get('batchNumber')?.hasError('required')">
            Batch number is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" placeholder="Enter quantity">
          <mat-error *ngIf="batchForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="batchForm.get('quantity')?.hasError('min')">
            Quantity must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Purchase Price</mat-label>
          <input matInput type="number" formControlName="purchasePrice" placeholder="Enter purchase price">
          <mat-error *ngIf="batchForm.get('purchasePrice')?.hasError('required')">
            Purchase price is required
          </mat-error>
          <mat-error *ngIf="batchForm.get('purchasePrice')?.hasError('min')">
            Purchase price must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Manufacturing Date</mat-label>
          <input matInput [matDatepicker]="manufacturingPicker" formControlName="manufacturingDate">
          <mat-datepicker-toggle matSuffix [for]="manufacturingPicker"></mat-datepicker-toggle>
          <mat-datepicker #manufacturingPicker></mat-datepicker>
          <mat-error *ngIf="batchForm.get('manufacturingDate')?.hasError('required')">
            Manufacturing date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Expiration Date</mat-label>
          <input matInput [matDatepicker]="expirationPicker" formControlName="expirationDate">
          <mat-datepicker-toggle matSuffix [for]="expirationPicker"></mat-datepicker-toggle>
          <mat-datepicker #expirationPicker></mat-datepicker>
          <mat-error *ngIf="batchForm.get('expirationDate')?.hasError('required')">
            Expiration date is required
          </mat-error>
          <mat-error *ngIf="batchForm.get('expirationDate')?.hasError('expirationDateInvalid')">
            Expiration date must be after manufacturing date
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="batchForm.invalid">
          {{data.batch ? 'Update' : 'Create'}} Batch
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class BatchFormComponent implements OnInit {
  batchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<BatchFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.batchForm = this.fb.group({
      batchNumber: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      manufacturingDate: [null, Validators.required],
      expirationDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.batch) {
      this.batchForm.patchValue(this.data.batch);
    }

    // Add custom validator for expiration date
    this.batchForm.get('expirationDate')?.setValidators([
      Validators.required,
      (control) => {
        const manufacturingDate = this.batchForm.get('manufacturingDate')?.value;
        return control.value <= manufacturingDate ? { expirationDateInvalid: true } : null;
      }
    ]);
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      const batchData = this.batchForm.value;

      if (this.data.batch) {
        this.productService.updateBatch(this.data.productId, this.data.batch.id, batchData).subscribe({
          next: () => {
            this.snackBar.open('Batch updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error updating batch', 'Close', { duration: 3000 });
            console.error('Error updating batch:', error);
          }
        });
      } else {
        this.productService.createBatch(this.data.productId, batchData).subscribe({
          next: () => {
            this.snackBar.open('Batch created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error creating batch', 'Close', { duration: 3000 });
            console.error('Error creating batch:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 