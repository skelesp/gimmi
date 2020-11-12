import { TestBed } from '@angular/core/testing';

import { PersonNameResolverService } from './person-name-resolver.service';

describe('PersonNameResolverService', () => {
  let service: PersonNameResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonNameResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
