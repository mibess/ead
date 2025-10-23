import { Routes } from '@angular/router';

import { LoginPage } from './core/auth/login/login.page';
import { SignupPage } from './core/auth/signup/signup.page';
import { HomePage } from './pages/home/home.page';

import { DASHBOARD_ROUTES } from './pages/dashboard/dashboard.routes';

export const routes: Routes = [
  /* public routes */
  { path : '', component: HomePage },
  { path : 'login', component: LoginPage },
  { path : 'signup', component: SignupPage },
  /* protected routes */
  { path : 'dashboard', children: DASHBOARD_ROUTES }
];
