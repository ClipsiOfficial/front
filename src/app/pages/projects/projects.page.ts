import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../services/layout.service'; // <--- IMPORTAR SERVICIO

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.css']
})
export class ProjectsPage implements OnInit, OnDestroy {

  loading = false;
  hasProjects = false;

  constructor(
    private router: Router,
    private layout: LayoutService // <--- INYECTAR SERVICIO
  ) {
    this.layout.showMinimalHeader();
  }

  ngOnInit() {
  
    setTimeout(() => {
      this.hasProjects = false;
      this.loading = false;
    }, 700);
  }

  ngOnDestroy() {
    
  }

  createProject() {
    this.router.navigate(['/projects/new']);
  }
}
