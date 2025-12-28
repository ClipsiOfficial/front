import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  protected baseUrl = environment.apiURL;

  /**
   * Construye los headers con autenticación si es necesario
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<T>(url, {
      ...options,
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: { params?: any }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(url, body, {
      ...options,
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: { params?: any }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.patch<T>(url, body, {
      ...options,
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: { params?: any }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, body, {
      ...options,
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: { body?: any; params?: any }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url, {
      ...options,
      headers: this.getAuthHeaders(),
    });
  }
}
