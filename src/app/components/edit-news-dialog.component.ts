import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SavedNews, AVAILABLE_CATEGORIES } from '../models/news.model';

@Component({
  selector: 'app-edit-news-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Edit Saved News</h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="space-y-4">
          <mat-form-field class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="News title" />
            <mat-error *ngIf="form.get('title')?.hasError('required')">
              Title is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Summary</mat-label>
            <textarea
              matInput
              formControlName="summary"
              placeholder="News summary"
              rows="6">
            </textarea>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option [value]="null">None</mat-option>
              @for (cat of availableCategories; track cat) {
                <mat-option [value]="cat">{{ cat }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-stroked-button (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="form.invalid">
          Save Changes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 350px;
      max-width: 600px;
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

    textarea {
      resize: vertical;
    }
  `]
})
export class EditNewsDialogComponent {
  private dialogRef = inject(MatDialogRef<EditNewsDialogComponent>);
  private formBuilder = inject(FormBuilder);
  private data = inject(MAT_DIALOG_DATA) as { news: SavedNews };

  availableCategories = AVAILABLE_CATEGORIES;
  form: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      title: [this.data.news.title, [Validators.required, Validators.minLength(1)]],
      summary: [this.data.news.summary || ''],
      category: [this.data.news.category || null],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
