import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './core/components/layout/layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./pages/my-requests/my-requests').then((m) => m.MyRequests),
      },
      {
        path: 'requests/to-approve',
        loadComponent: () =>
          import('./pages/pending-requests/pending-requests').then(
            (m) => m.PendingRequests
          ),
        canActivate: [authGuard],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then((m) => m.Categories),
        canActivate: [authGuard], // se hai adminGuard, aggiungilo
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/stats/stats').then((m) => m.Stats),
        canActivate: [authGuard], // + eventuale adminGuard
      },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: 'login' },
];
