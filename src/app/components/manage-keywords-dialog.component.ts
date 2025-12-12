import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Palabras clave - {{ data.project.name }}</h2>
    
    <mat-dialog-content>
      <div class="keywords-container">
        
        <!-- Input para añadir nueva palabra clave -->
        <div class="keyword-input-container">
          <input 
            type="text"
            class="keyword-input"
            [formControl]="keywordInput"
            (keyup.enter)="addKeyword()"
            placeholder="Escribe y presiona Enter"
            [disabled]="loading"
          >
          <button 
            mat-icon-button 
            (click)="addKeyword()"
            [disabled]="!keywordInput.value?.trim() || loading"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <!-- Spinner de carga -->
        <div *ngIf="loading" style="text-align: center; padding: 20px;">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Lista de palabras clave -->
        <div class="keywords-list" *ngIf="!loading">
          <mat-chip-set aria-label="Keywords">
            <mat-chip 
              *ngFor="let keyword of keywords"
              (removed)="removeKeyword(keyword)"
            >
              {{ keyword.content }}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          </mat-chip-set>
          
          <p *ngIf="keywords.length === 0" class="empty-message">
            No hay palabras clave añadidas. Añade algunas para mejorar la búsqueda de noticias.
          </p>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()" [disabled]="loading">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .keywords-container {
      min-height: 200px;
      padding: 10px 0;
    }

    .keyword-input-container {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      align-items: center;
    }

    .keyword-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .keyword-input:focus {
      border-color: #3f51b5;
    }

    .keyword-input::placeholder {
      color: #999;
    }

    .keywords-list {
      margin-top: 10px;
    }

    mat-chip {
      margin: 4px;
    }

    .empty-message {
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
      text-align: center;
      padding: 20px;
    }

    mat-dialog-content {
      max-height: 500px;
      overflow-y: auto;
      border: none !important;
    }

    ::ng-deep .mat-mdc-dialog-content {
      border-top: none !important;
      border-bottom: none !important;
    }
  `]
})
export class ManageKeywordsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ManageKeywordsDialogComponent>);
  readonly data = inject<{ project: Project }>(MAT_DIALOG_DATA);
  private projectsService = inject(ProjectsService);
  private cdr = inject(ChangeDetectorRef);

  keywordInput = new FormControl('');
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
    const value = this.keywordInput.value?.trim();
    if (!value || this.keywords.some(k => k.content === value)) {
      return;
    }

    this.loading = true;
    this.projectsService.addKeyword(this.data.project.id, value).subscribe({
      next: (newKeyword) => {
        this.keywords.push(newKeyword);
        this.keywordInput.reset();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error adding keyword:', err);
        alert('Error al añadir la palabra clave');
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error removing keyword:', err);
        alert('Error al eliminar la palabra clave');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
