import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/results',
    pathMatch: 'full',
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./pages/results/results.page').then((m) => m.ResultsPage),
    canActivate: [authGuard],
  },
  {
    path: 'my-news',
    loadComponent: () =>
      import('./pages/my-news/my-news.page').then((m) => m.MyNewsPage),
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./pages/statistics/statistics.page').then((m) => m.StatisticsPage),
    canActivate: [authGuard],
  },
  // {
  //   path: 'projects',
  //   loadComponent: () =>
  //     import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
  // },
  // {
  //   path: 'projects/new',
  //   loadComponent: () =>
  //     import('./pages/projects/new-project.page').then((m) => m.NewProjectComponent),
  // },
  // {
  // path: 'projects-page',
  // loadComponent: () =>
  //   import('./pages/projects/projects-page.page').then((m) => m.ProjectsPage)
  // },
  {
    path: 'login',
    loadComponent: () =>
    import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
