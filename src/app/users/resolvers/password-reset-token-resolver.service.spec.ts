import { TestBed } from '@angular/core/testing';

import { PasswordResetTokenResolverService } from './password-reset-token-resolver.service';

describe('PasswordResetTokenResolverService', () => {
  let service: PasswordResetTokenResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordResetTokenResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
