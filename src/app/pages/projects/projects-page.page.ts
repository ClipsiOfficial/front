import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './projects-page.page.html',
  styleUrls: ['./projects-page.page.css']
})
export class ProjectsPage implements OnInit {

  private layout = inject(LayoutService);
  private projectsService = inject(ProjectsService);

  projects: Project[] = [];
  loading = true;

  constructor() {
    // 🔥 MUY IMPORTANTE → activar header minimalista
    this.layout.showMinimalHeader();
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
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
