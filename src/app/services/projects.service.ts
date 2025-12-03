import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private http = inject(HttpClient);

  private API_URL = 'http://localhost:8787/projects';
  // Ajusta esto según la URL real de tu backend

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API_URL);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`);
  }

  createProject(data: {
    name: string;
    description?: string;
    topic: string;
    ownerId: number;
    members: number[];
  }): Observable<Project> {
    return this.http.post<Project>(this.API_URL, data);
  }
}
