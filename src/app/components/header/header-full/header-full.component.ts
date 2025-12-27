import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header-full',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header-full.component.html',
})
export class HeaderFullComponent {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  actualTheme = this.themeService.actualTheme;
  currentTheme = this.themeService.theme;
  mobileMenuOpen = signal(false);
  projectTitle = toSignal(this.layoutService.projectTitle$);

  private extractProjectId(): string | null {
    const urlParts = this.router.url.split('/');
    if (urlParts[1] === 'results' || urlParts[1] === 'my-news' || urlParts[1] === 'statistics') {
      return urlParts[2] || null;
    }
    return null;
  }

  projectId = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.extractProjectId()),
      startWith(this.extractProjectId())
    ),
    { initialValue: this.extractProjectId() }
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
