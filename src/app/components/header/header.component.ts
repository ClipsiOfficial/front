import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
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
  private layout = inject(LayoutService);

  // signals locales
  private _mobileMenuOpen = signal(false);
  private _minimal = signal(false);

  // suscripción para sincronizar con LayoutService
  private sub = new Subscription();

  constructor() {
    // sincroniza el valor inicial y los cambios posteriores
    this.sub.add(
      this.layout.minimalHeader$.subscribe(v => {
        this._minimal.set(!!v);
        if (v) {
          this._mobileMenuOpen.set(false); // cerrar menú al pasar a minimal
        }
      })
    );
  }

  // getters para la plantilla (booleans puros, siempre seguros)
  get isMinimal(): boolean {
    return this._minimal();
  }

  get isMobileOpen(): boolean {
    return this._mobileMenuOpen();
  }

  // wrappers para la plantilla
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this._mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this._mobileMenuOpen.set(false);
  }

  // evita fugas
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // helpers de theme (si ya usabas signals ahí, se llaman como función)
  actualTheme() {
    return this.themeService.actualTheme();
  }
}
