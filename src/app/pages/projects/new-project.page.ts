import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../services/layout.service'; 

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
    private layout: LayoutService
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
    console.log("Proyecto creado:", payload);

    // Aquí harás: this.projectService.createProject(payload).subscribe(...)
    
    // Simulación:
    alert("Proyecto creado con éxito!");
    this.router.navigate(['/projects']);
  }

  cancel() {
    this.router.navigate(['/projects']);
  }
}
