import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);

  // Método para actualizar el perfil
  updateProfile(data: { username?: string; email?: string; password?: string }): Observable<User> {
    return this.api.patch<User>('/user', data);
  }
}
