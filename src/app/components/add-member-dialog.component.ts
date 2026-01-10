import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Add Member</h2>

      <mat-dialog-content>
        <form [formGroup]="form">
          <mat-form-field class="full-width">
            <mat-label>User email</mat-label>
            <input matInput formControlName="email" placeholder="user@example.com" type="email">
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Invalid email
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-stroked-button (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onAdd()"
          [disabled]="form.invalid"
        >
          Add
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 300px;
      max-width: 500px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
  `]
})
export class AddMemberDialogComponent {
  private dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  private formBuilder = inject(FormBuilder);
  private data = inject(MAT_DIALOG_DATA) as { project: Project };

  form: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.email);
    }
  }
}
