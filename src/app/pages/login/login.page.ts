import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  private router = inject(Router);
  private layout = inject(LayoutService);
  private authService = inject(AuthService);

  constructor() {
    this.layout.showLoginHeader();
  }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.layout.showFullHeader();
          this.router.navigate(['/results']);
        },
        error: (err) => {
          console.error('Login error', err);
          this.errorMessage = 'Invalid credentials or server error';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields';
    }
  }
}
