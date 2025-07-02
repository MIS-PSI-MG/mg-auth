import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // if (authService.role !== 'admin') {
  //   router.navigate(['']);
  //   return false;
  // }

  const user = authService.currentUserSig();

  // Still loading (undefined)? Block navigation until resolved
  if (user === undefined) {
    return false;
  }

  // Not logged in?
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Not an admin?
  if (user.role !== 'admin') {
    router.navigate(['/']);
    return false;
  }
  return true;
};
