import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class NewProjectComponent {

  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private layout: LayoutService,
    private projectsService: ProjectsService,
    private snackBar: MatSnackBar
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

    const payload = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      topic: this.projectForm.value.topic,
    };

    this.projectsService.createProject(payload).subscribe({
      next: (_) => {
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error("Error creando proyecto", err);
        this.snackBar.open('Error creating project', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/projects']);
  }
}
