import { CanActivateFn } from '@angular/router';

export const protectedGuard: CanActivateFn = (route, state) => {
  return true;
};
