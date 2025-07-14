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
      // Aggiungi qui altri elementi alla sidebar
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: 'login' },
];
