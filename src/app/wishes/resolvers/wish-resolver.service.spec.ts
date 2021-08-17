import { TestBed } from '@angular/core/testing';

import { WishResolverService } from './wish-resolver.service';

describe('WishResolverService', () => {
  let service: WishResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
