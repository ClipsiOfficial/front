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
    members: number[]|null;
  }): Observable<Project> {
    return this.http.post<Project>(this.API_URL, data);
  }

  updateProject(id: number, data: {
    name?: string;
    description?: string;
  }): Observable<Project> {
    return this.http.patch<Project>(`${this.API_URL}/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  addMember(projectId: number, email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${projectId}/members`, { email });
  }

  removeMember(projectId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${projectId}/members`, { body: { userId } });
  }

  getProjectMembers(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${projectId}/members`);
  }

  // Keywords
  getKeywords(projectId: number): Observable<{ id: number; content: string; searches: number; projectId: number }[]> {
    return this.http.get<{ id: number; content: string; searches: number; projectId: number }[]>(`${this.API_URL}/${projectId}/keywords`);
  }

  addKeyword(projectId: number, content: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${projectId}/keywords`, { content });
  }

  deleteKeyword(projectId: number, keywordId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${projectId}/keywords/${keywordId}`);
  }
}
