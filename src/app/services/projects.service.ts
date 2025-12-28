import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private api = inject(ApiService);

  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('/projects');
  }

  getProject(id: number): Observable<Project> {
    return this.api.get<Project>(`/projects/${id}`);
  }

  createProject(data: {
    name: string;
    description?: string;
    topic: string;
  }): Observable<Project> {
    return this.api.post<Project>('/projects', data);
  }

  updateProject(id: number, data: {
    name?: string;
    description?: string;
  }): Observable<Project> {
    return this.api.patch<Project>(`/projects/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.api.delete<void>(`/projects/${id}`);
  }

  addMember(projectId: number, email: string): Observable<any> {
    return this.api.post(`/projects/${projectId}/members`, { email });
  }

  removeMember(projectId: number, userId: number): Observable<any> {
    return this.api.delete(`/projects/${projectId}/members`, { body: { userId } });
  }

  getProjectMembers(projectId: number): Observable<any[]> {
    return this.api.get<any[]>(`/projects/${projectId}/members`);
  }

  // Keywords
  getKeywords(projectId: number): Observable<{ id: number; content: string; searches: number; projectId: number }[]> {
    return this.api.get<{ id: number; content: string; searches: number; projectId: number }[]>(`/projects/${projectId}/keywords`);
  }

  addKeyword(projectId: number, content: string): Observable<any> {
    return this.api.post(`/projects/${projectId}/keywords`, { content });
  }

  deleteKeyword(projectId: number, keywordId: number): Observable<any> {
    return this.api.delete(`/projects/${projectId}/keywords/${keywordId}`);
  }
}
