import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-minimal',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header-minimal.component.html',
})
export class HeaderMinimalComponent {
  private themeService = inject(ThemeService);
  currentTheme = this.themeService.theme;
  actualTheme = this.themeService.actualTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
