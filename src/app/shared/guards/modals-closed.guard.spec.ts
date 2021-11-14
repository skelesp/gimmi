import { TestBed } from '@angular/core/testing';

import { ModalsClosedGuard } from './modals-closed.guard';

describe('ModalsClosedGuard', () => {
  let guard: ModalsClosedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModalsClosedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
