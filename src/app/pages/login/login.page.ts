import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private layout: LayoutService) {
    this.layout.showLoginHeader();
  }

  onLogin() {
    if (this.username && this.password) {
      console.log('Usuario:', this.username);
      console.log('Contraseña:', this.password);
      alert('Login exitoso (simulado)');
      this.layout.showFullHeader();
      this.router.navigate(['/results']);
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
}
