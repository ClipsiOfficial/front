import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-members-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="bg-card text-card-foreground w-full">
      <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col space-y-1">
            <h2 class="text-xl font-semibold leading-none tracking-tight">Manage Members</h2>
            <p class="text-sm text-muted-foreground">
              Manage access to <strong>{{ project.name }}</strong>
            </p>
          </div>
          <button (click)="close()" class="w-8 h-8 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <mat-icon class="!w-4 !h-4 !text-base leading-none flex items-center justify-center">close</mat-icon>
            <span class="sr-only">Close</span>
          </button>
        </div>

        <!-- Add Member Form -->
        <form [formGroup]="addForm" (ngSubmit)="onAdd()" class="flex items-start gap-3">
          <div class="flex-1 space-y-2">
            <input
              type="email"
              formControlName="email"
              placeholder="user@example.com"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              [class.border-destructive]="addForm.get('email')?.invalid && addForm.get('email')?.touched"
            >
            <div *ngIf="addForm.get('email')?.invalid && addForm.get('email')?.touched" class="text-xs text-destructive font-medium ml-1">
              <span *ngIf="addForm.get('email')?.hasError('required')">Email is required</span>
              <span *ngIf="addForm.get('email')?.hasError('email')">Invalid email address</span>
            </div>
          </div>
          
          <button
            type="submit"
            [disabled]="addForm.invalid || adding()"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-[72px] px-4 py-2"
          >
            <span *ngIf="!adding()">Add</span>
            <mat-icon *ngIf="adding()" class="animate-spin !w-5 !h-5 !text-lg !leading-none flex items-center justify-center">sync</mat-icon>
          </button>
        </form>

        <!-- Messages -->
        <div *ngIf="message()" [class]="'p-3 rounded-md text-sm flex items-center gap-2 ' + (message()?.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-green-500/15 text-green-600')">
          <mat-icon class="!text-lg !w-5 !h-5 !leading-none flex items-center justify-center">{{ message()?.type === 'error' ? 'error' : 'check_circle' }}</mat-icon>
          {{ message()?.text }}
        </div>

        <div class="space-y-4">
           <h3 class="text-sm font-medium leading-none text-muted-foreground">Current Members</h3>
           
           <!-- Loading -->
           <div *ngIf="loading() && members().length === 0" class="flex justify-center py-8">
             <mat-icon class="animate-spin text-primary !text-2xl !w-6 !h-6 !leading-none flex items-center justify-center">sync</mat-icon>
           </div>

           <!-- Empty State -->
           <div *ngIf="!loading() && members().length === 0" class="text-center py-8 border-2 border-dashed rounded-lg border-muted">
              <mat-icon class="text-muted-foreground/50 !text-4xl !w-10 !h-10 mb-2 !leading-none flex items-center justify-center mx-auto">people_outline</mat-icon>
              <p class="text-sm text-muted-foreground">No members yet.</p>
           </div>

           <!-- List -->
           <div *ngIf="members().length > 0" class="space-y-2 max-h-[250px] overflow-y-auto -mr-2 pr-2 custom-scrollbar">
             <div *ngFor="let m of members()" class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors group">
               <div class="flex items-center gap-3 overflow-hidden">
                 <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                   {{ (m.username || m.email).charAt(0).toUpperCase() }}
                 </div>
                 <div class="flex flex-col min-w-0">
                   <span class="text-sm font-medium truncate">{{ m.username || 'User' }}</span>
                   <span class="text-xs text-muted-foreground truncate">{{ m.email }}</span>
                 </div>
               </div>
               
               <button
                 (click)="remove(m.id)"
                 title="Remove member"
                 class="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
               >
                 <mat-icon class="!text-lg !w-5 !h-5 !leading-none flex items-center justify-center">delete_outline</mat-icon>
               </button>
             </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end pt-2">
          <button (click)="close()" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ManageMembersDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ManageMembersDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as { project: Project };
  private projectsService = inject(ProjectsService);
  private fb = inject(FormBuilder);

  project = this.data.project;
  
  // Signals State
  members = signal<any[]>([]);
  loading = signal(true);
  adding = signal(false);
  message = signal<{ type: 'success' | 'error', text: string } | null>(null);

  addForm: FormGroup;

  constructor() {
    this.addForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading.set(true);
    this.projectsService.getProjectMembers(this.project.id).subscribe({
      next: (list) => {
        this.members.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.showMessage('error', err.error?.message || 'Error loading members');
      }
    });
  }

  remove(userId: number): void {
    if (!confirm('Are you sure you want to remove this member?')) return;
    this.projectsService.removeMember(this.project.id, userId).subscribe({
      next: () => {
        this.loadMembers();
        this.showMessage('success', 'Member removed');
      },
      error: (err) => this.showMessage('error', err.error?.message || 'Error removing member')
    });
  }

  onAdd(): void {
    if (this.addForm.invalid) return;
    const email = this.addForm.value.email;
    this.adding.set(true);
    this.message.set(null);
    
    this.projectsService.addMember(this.project.id, email).subscribe({
      next: () => {
        this.adding.set(false);
        this.addForm.reset();
        this.loadMembers();
        this.showMessage('success', 'Member added successfully');
      },
      error: (err) => {
        this.adding.set(false);
        this.showMessage('error', err.error?.message || 'Error adding member');
      }
    });
  }

  showMessage(type: 'success' | 'error', text: string) {
    const msg = { type, text };
    this.message.set(msg);
    setTimeout(() => {
      // Check if the current message is still the same one we set 3s ago
      if (this.message() === msg) {
        this.message.set(null);
      }
    }, 3000);
  }

  close(): void {
    this.dialogRef.close();
  }
}
