import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8787/user';

  // Método para actualizar el perfil
  updateProfile(data: { username?: string; email?: string; password?: string }): Observable<User> {
    const token = localStorage.getItem('token'); // Obtenemos el token guardado
    if (!token) {
      throw new Error('User token is missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.patch<User>(this.API_URL, data, { headers });
  }
}
