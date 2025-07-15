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
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: 'login' },
];
