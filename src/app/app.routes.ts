import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { adminGuard } from './guards/admin.guard';

// Optional: loading helper
function withLoader<T>(importFn: () => Promise<T>): () => Promise<T> {
  return () => {
    document.body.classList.add('loading');
    return importFn().then((mod) => {
      document.body.classList.remove('loading');
      return mod;
    });
  };
}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ Lazy-loaded + guarded admin route
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: withLoader(() =>
      import('./components/admin/admin.component').then((m) => m.AdminComponent)
    ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
