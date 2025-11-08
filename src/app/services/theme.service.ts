import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'clipsi-ui-theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  theme = signal<Theme>(this.getInitialTheme());
  private systemPrefersDark = signal<boolean>(this.mediaQuery.matches);

  actualTheme = computed(() => {
    const theme = this.theme();
    return theme === 'system' ? (this.systemPrefersDark() ? 'dark' : 'light') : theme;
  });

  constructor() {
    // Listen for system theme changes and update the signal
    this.mediaQuery.addEventListener('change', (e) => {
      this.systemPrefersDark.set(e.matches);
    });

    // Apply theme changes to document
    effect(() => {
      const actualTheme = this.actualTheme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(actualTheme);
      localStorage.setItem(this.STORAGE_KEY, this.theme());
    });
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system'; // Default to system
  }

  toggleTheme(): void {
    this.theme.update((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  }
}
