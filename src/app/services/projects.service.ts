import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {

  constructor() {}

  // Datos simulados para mostrar la página
  getProjects(): Observable<Project[]> {
    return of([
      { id: 1, name: 'Proyecto Clipsi', description: 'Sistema de noticias con IA', topic: 'Tecnología' },
      { id: 2, name: 'Proyecto Universidad', description: 'Trabajo final de carrera', topic: 'Educación' }
    ]);
  }
}
