import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

type HeaderMode = 'full' | 'minimal' | 'login';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  mode = toSignal(this.layoutService.headerMode$, { initialValue: 'full' as HeaderMode });
  projects = signal<Project[]>([]);
  currentTheme = this.themeService.theme;
  actualTheme = this.themeService.actualTheme;
  projectTitle = toSignal(this.layoutService.projectTitle$);
  mobileMenuOpen = signal(false);

  isLoggedIn = computed(() => this.mode() !== 'login');
  showNav = computed(() => this.mode() === 'full');
  isProjectsPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url === '/projects'),
      startWith(this.router.url === '/projects')
    ),
    { initialValue: this.router.url === '/projects' }
  );

  themeTooltip = computed(() => {
    if (this.currentTheme() === 'system') return 'Usar tema del sistema';
    return this.actualTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  });

  themeIcon = computed(() => {
    if (this.currentTheme() === 'system') return 'monitor';
    return this.actualTheme() === 'dark' ? 'dark_mode' : 'light_mode';
  });

  private extractProjectId(): string | null {
    const urlParts = this.router.url.split('/');
    if (['results', 'my-news', 'statistics'].includes(urlParts[1])) {
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
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  loadProjects(): void {
    if (this.isLoggedIn() && this.projects().length === 0) {
      this.projectsService.getProjects().subscribe({
        next: (projects) => this.projects.set(projects),
        error: () => this.projects.set([])
      });
    }
  }

  navigateToProject(projectId: number): void {
    const currentUrl = this.router.url;
    const urlParts = currentUrl.split('/');
    
    if (urlParts[1] === 'results') {
      this.router.navigate(['/results', projectId]);
    } else if (urlParts[1] === 'my-news') {
      this.router.navigate(['/my-news', projectId]);
    } else if (urlParts[1] === 'statistics') {
      this.router.navigate(['/statistics', projectId]);
    } else {
      this.router.navigate(['/results', projectId]);
    }
  }
}
