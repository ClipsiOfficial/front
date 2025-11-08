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
    path: '**',
    redirectTo: '/results',
  },
];
