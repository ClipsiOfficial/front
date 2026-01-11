import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Project } from '../models/project.model';
import { ProjectsService } from '../services/projects.service';

interface Keyword {
  id: number;
  content: string;
}

@Component({
  selector: 'app-manage-keywords-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="bg-card w-full">
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Keywords - {{ data.project.name }}</h2>
          <button (click)="close()" class="hover:bg-secondary/50 p-1 rounded-full transition-colors">
            <mat-icon class="text-foreground w-5 h-5 flex items-center justify-center text-base">close</mat-icon>
          </button>
        </div>

        <p class="text-sm text-muted-foreground">
          Add or remove keywords to filter news.
        </p>

        <!-- Input para añadir nueva palabra clave -->
        <div class="flex gap-2">
          <input
            type="text"
            class="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm"
            [(ngModel)]="newKeywordInput"
            (keyup.enter)="addKeyword()"
            placeholder="Type and press Enter"
            [disabled]="loading"
          >
          <button
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            (click)="addKeyword()"
            [disabled]="!newKeywordInput.trim() || loading"
          >
            +
          </button>
        </div>

        <!-- Spinner de carga -->
        <div *ngIf="loading && keywords.length === 0" class="flex justify-center py-4">
          <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>

        <!-- Lista de palabras clave -->
        <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar" *ngIf="keywords.length > 0">
          <div *ngFor="let keyword of keywords" class="flex items-center justify-between p-2 bg-secondary/50 rounded-lg group">
            <span class="text-sm">{{ keyword.content }}</span>
            <button
              (click)="removeKeyword(keyword)"
              class="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors opacity-70 group-hover:opacity-100"
              [disabled]="loading"
            >
              <mat-icon class="w-4 h-4 flex items-center justify-center text-sm">close</mat-icon>
            </button>
          </div>
        </div>

        <p *ngIf="!loading && keywords.length === 0" class="text-sm text-muted-foreground text-center py-4">
          No keywords added.
        </p>

        <div class="flex justify-end pt-2">
          <button (click)="close()" class="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      border-radius: 0.5rem;
      overflow: hidden;
    }
  `]
})
export class ManageKeywordsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ManageKeywordsDialogComponent>);
  readonly data = inject<{ project: Project }>(MAT_DIALOG_DATA);
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  newKeywordInput = '';
  keywords: Keyword[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadKeywords();
  }

  loadKeywords(): void {
    this.loading = true;
    this.projectsService.getKeywords(this.data.project.id).subscribe({
      next: (keywords) => {
        this.keywords = keywords;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading keywords:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addKeyword(): void {
    const value = this.newKeywordInput.trim();
    if (!value || this.keywords.some(k => k.content === value)) {
      return;
    }

    this.loading = true;
    this.projectsService.addKeyword(this.data.project.id, value).subscribe({
      next: (newKeyword) => {
        this.keywords.push(newKeyword);
        this.newKeywordInput = '';
        this.loading = false;
        this.snackBar.open('✓ Keyword added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error adding keyword:', err);
        const errorMessage = err?.error?.message || 'Error adding keyword';
        this.snackBar.open(`❌ ${errorMessage}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeKeyword(keyword: Keyword): void {
    this.loading = true;
    this.projectsService.deleteKeyword(this.data.project.id, keyword.id).subscribe({
      next: () => {
        const index = this.keywords.findIndex(k => k.id === keyword.id);
        if (index >= 0) {
          this.keywords.splice(index, 1);
        }
        this.loading = false;
        this.snackBar.open('✓ Keyword removed successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error removing keyword:', err);
        const errorMessage = err?.error?.message || 'Error removing keyword';
        this.snackBar.open(`❌ ${errorMessage}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  close(): void {
    this.dialogRef.close(this.keywords);
  }
}
