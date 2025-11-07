import { Component, output, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

export type Tab = 'results' | 'my-news' | 'statistics';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private themeService = inject(ThemeService);

  activeTab = input.required<Tab>();
  tabChange = output<Tab>();

  isDark = this.themeService.theme;
  mobileMenuOpen = signal(false);

  onTabClick(tab: Tab): void {
    this.tabChange.emit(tab);
    this.mobileMenuOpen.set(false); // Close mobile menu after selection
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  getTabLabel(tab: Tab): string {
    const labels = {
      results: 'Resultados',
      'my-news': 'Mis Noticias',
      statistics: 'Estadísticas',
    };
    return labels[tab];
  }
}

