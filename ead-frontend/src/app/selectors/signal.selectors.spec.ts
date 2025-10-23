import { TestBed } from '@angular/core/testing';

import { SignalSelectors } from './signal.selectors';

describe('SignalSelectors', () => {
  let service: SignalSelectors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalSelectors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
