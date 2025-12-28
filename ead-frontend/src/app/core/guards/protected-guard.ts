import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const protectedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!localStorage.getItem('userLoggedIn')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
