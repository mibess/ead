import { TestBed } from '@angular/core/testing';

import { DashboardRoutes } from './dashboard.routes';

describe('DashboardRoutes', () => {
  let service: DashboardRoutes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardRoutes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
