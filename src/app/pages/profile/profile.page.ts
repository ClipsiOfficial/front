import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  username: string = '';
  email: string = '';
  subscriptionType: string = '';

  private API_URL = 'http://localhost:8787/user';

  constructor() {
    const user = this.auth.currentUser();
    console.log('Current user from AuthService:', user);

    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.subscriptionType = user.subscriptionId ? 'Premium' : 'Free';
    }
    this.auth.updateProfile({ username: this.username, email: this.email }).subscribe({
      next: (u) => this.snackBar.open('Perfil sincronizado', 'Cerrar', { duration: 2000 }),
      error: (err) => console.error('Error al sincronizar perfil', err)
    });
  }

  updateProfile() {
    const token = this.auth.getToken();
    if (!token) {
      this.snackBar.open('No authentication token found.', 'Cerrar', { duration: 3000 });
      return;
    }

    console.log('Updating profile for user:', {
      username: this.username,
      email: this.email
    });

    this.http.patch(this.API_URL, {
      username: this.username,
      email: this.email
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (updatedUser: any) => {
        // 1️⃣ Actualizar la señal de usuario
        this.auth.currentUser.set(updatedUser);

        // 2️⃣ Guardar en localStorage
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));

        // 3️⃣ Feedback al usuario
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }

}
