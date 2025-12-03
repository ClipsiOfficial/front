import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-new-project',
  standalone: true,
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class NewProjectComponent {

  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private layout: LayoutService,
    private projectsService: ProjectsService    //  AÑADIDO
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: [''],
      topic: ['', Validators.required],
    });

    this.layout.showMinimalHeader();
  }

  submit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const payload = this.projectForm.value;

    //  REAL PETICIÓN AL BACKEND
    this.projectsService.createProject(payload).subscribe({
      next: (project) => {
        console.log("Proyecto creado:", project);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error("Error creando proyecto", err);
        alert("Hubo un error al crear el proyecto.");
      }
    });
  }

  cancel() {
    this.router.navigate(['/projects']);
  }
}
