import { TestBed } from '@angular/core/testing';

import { AuhtService } from './auht.service';

describe('AuhtService', () => {
  let service: AuhtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuhtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
