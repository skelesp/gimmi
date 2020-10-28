import { TestBed } from '@angular/core/testing';

import { EmailQueryParamGuard } from './email-query-param.guard';

describe('EmailQueryParamGuard', () => {
  let guard: EmailQueryParamGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmailQueryParamGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
