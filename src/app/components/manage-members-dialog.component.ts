import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manage-members-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Miembros de {{ project.name }}</h2>

    <mat-dialog-content>
      <form [formGroup]="addForm" class="add-form" (ngSubmit)="onAdd()">
        <mat-form-field class="full-width">
          <mat-label>Email del usuario</mat-label>
          <input matInput formControlName="email" placeholder="usuario@ejemplo.com" type="email">
          <mat-error *ngIf="addForm.get('email')?.hasError('required')">El email es requerido</mat-error>
          <mat-error *ngIf="addForm.get('email')?.hasError('email')">Email inválido</mat-error>
        </mat-form-field>

        <div class="add-actions">
          <button mat-stroked-button type="button" (click)="loadMembers()">Recargar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="addForm.invalid || adding">Agregar</button>
        </div>
      </form>

      <div *ngIf="loading" class="loading">Cargando miembros...</div>

      <mat-list *ngIf="!loading && members.length > 0">
        <mat-list-item *ngFor="let m of members">
          <div mat-line>{{ m.username || m.email }}</div>
          <div mat-line class="muted">{{ m.email }}</div>
          <button mat-icon-button color="warn" (click)="remove(m.id)" title="Eliminar miembro">
            <mat-icon>remove_circle</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>

      <div *ngIf="!loading && members.length === 0">No hay miembros</div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-stroked-button (click)="close()">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .add-form { display:flex; gap:12px; align-items:center; margin-bottom:12px }
    .full-width { width:100% }
    .add-actions { display:flex; gap:8px }
  `]
})
export class ManageMembersDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ManageMembersDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as { project: Project };
  private projectsService = inject(ProjectsService);
  private fb = inject(FormBuilder);

  project = this.data.project;
  members: any[] = [];
  loading = true;
  addForm: FormGroup;
  adding = false;

  constructor() {
    this.addForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading = true;
    this.projectsService.getProjectMembers(this.project.id).subscribe({
      next: (list) => {
        this.members = list;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Error al cargar miembros');
      }
    });
  }

  remove(userId: number): void {
    if (!confirm('¿Eliminar miembro?')) return;
    this.projectsService.removeMember(this.project.id, userId).subscribe({
      next: () => this.loadMembers(),
      error: (err) => alert(err.error?.message || 'Error al eliminar miembro')
    });
  }

  onAdd(): void {
    if (this.addForm.invalid) return;
    const email = this.addForm.value.email;
    this.adding = true;
    this.projectsService.addMember(this.project.id, email).subscribe({
      next: () => {
        this.adding = false;
        this.addForm.reset();
        this.loadMembers();
        alert('Miembro agregado correctamente');
      },
      error: (err) => {
        this.adding = false;
        alert(err.error?.message || 'Error al agregar miembro');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
