import { Routes } from '@angular/router';

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
  },
  {
    path: 'my-news',
    loadComponent: () =>
      import('./pages/my-news/my-news.page').then((m) => m.MyNewsPage),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./pages/statistics/statistics.page').then((m) => m.StatisticsPage),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: 'projects/new',
    loadComponent: () =>
      import('./pages/projects/new-project.page').then((m) => m.NewProjectComponent),
  },
  {
  path: 'projects-page',
  loadComponent: () =>
    import('./pages/projects/projects-page.page').then((m) => m.ProjectsPage)
  },
  {
    path: '**',
    redirectTo: '/results',
  },
];
