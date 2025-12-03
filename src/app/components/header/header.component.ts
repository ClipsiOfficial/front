import { Component, inject, signal } from '@angular/core';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
<<<<<<< Updated upstream

  currentTheme = this.themeService.theme;
  actualTheme = this.themeService.actualTheme;
  mobileMenuOpen = signal(false);

=======
  private layout = inject(LayoutService);

  // signals locales
  private _mobileMenuOpen = signal(false);

  // suscripción para sincronizar con LayoutService
  private sub = new Subscription();

  private _mode = signal<'full' | 'minimal' | 'login'>('full');

  constructor() {
    this.sub.add(
      this.layout.headerMode$.subscribe(v => {
        this._mode.set(v);
        if (v !== 'full') {
          this._mobileMenuOpen.set(false);
        }
      })
    );
  }

  get mode(): 'full' | 'minimal' | 'login' {
    return this._mode();
  }


  get isMobileOpen(): boolean {
    return this._mobileMenuOpen();
  }

  // wrappers para la plantilla
>>>>>>> Stashed changes
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}

