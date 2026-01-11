import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EditProjectDialogComponent } from '../../components/edit-project-dialog.component';
import { ManageMembersDialogComponent } from '../../components/manage-members-dialog.component';
import { ManageKeywordsDialogComponent } from '../../components/manage-keywords-dialog.component';

import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterModule,
  ]
})
export class ProjectsPage implements OnInit {

  private layout = inject(LayoutService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  projects: Project[] = [];
  loading = true;

  constructor(private cdr: ChangeDetectorRef) {
    this.layout.showMinimalHeader();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.urlAfterRedirects === '/projects')
      )
      .subscribe(() => {
        this.loadProjects();
      });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;

    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  editProject(project: Project, event: Event): void {
    event.stopPropagation();

    this.dialog.open(EditProjectDialogComponent, {
      data: { project },
      width: '500px'
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.projectsService.updateProject(project.id, result).subscribe({
          next: () => {
            this.loadProjects();
          },
          error: (err) => {
            const errorMessage = err?.error?.message || 'Error updating project';
            this.snackBar.open(`❌ ${errorMessage}`, 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar'],
            });
          }
        });
      }
    });
  }

  deleteProject(project: Project, event: Event): void {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.projectsService.deleteProject(project.id).subscribe({
        next: () => {
          this.snackBar.open('✓ Project deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.loadProjects();
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error deleting project';
          this.snackBar.open(`❌ ${errorMessage}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        }
      });
    }
  }

  manageMembers(project: Project, event: Event): void {
    event.stopPropagation();
    this.dialog.open(ManageMembersDialogComponent, {
      data: { project },
      width: '600px'
    }).afterClosed().subscribe(() => {
      this.loadProjects();
    });
  }

  manageKeywords(project: Project, event: Event): void {
    event.stopPropagation();

    this.dialog.open(ManageKeywordsDialogComponent, {
      data: { project },
      width: '600px'
    });
  }

  selectProject(project: Project): void {
    this.router.navigate(['/results', project.id]);
  }
}
