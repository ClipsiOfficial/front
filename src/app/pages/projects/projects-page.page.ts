import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProjectDialogComponent } from '../../components/edit-project-dialog.component';
import { ManageMembersDialogComponent } from '../../components/manage-members-dialog.component';
import { ManageKeywordsDialogComponent } from '../../components/manage-keywords-dialog.component';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  templateUrl: './projects-page.page.html',
  styleUrls: ['./projects-page.page.css'],
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    EditProjectDialogComponent,
    ManageMembersDialogComponent,
    ManageKeywordsDialogComponent
  ]
})
export class ProjectsPage implements OnInit {

  private layout = inject(LayoutService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

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
          error: () => {
            alert('Error al actualizar el proyecto');
          }
        });
      }
    });
  }

  deleteProject(project: Project, event: Event): void {
    event.stopPropagation();
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${project.name}"?`)) {
      this.projectsService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: () => {
          alert('Error al eliminar el proyecto');
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
}
