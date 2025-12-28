import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, provideRouter } from '@angular/router';

import { protectedGuard } from './protected-guard';

describe('protectedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([])
      ]
    });
  });

  it('should allow access when user is logged in', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue('{"id": "1", "name": "User"}');
      expect(protectedGuard(null as any, null as any)).toBeTrue();
    });
  });

  it('should redirect to login when user is not logged in', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');

      expect(protectedGuard(null as any, null as any)).toBeFalse();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});
