import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header-login.component.html',
})
export class HeaderLoginComponent {
  private themeService = inject(ThemeService);
  actualTheme = this.themeService.actualTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
