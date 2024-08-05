import { TestBed } from '@angular/core/testing';

import { CaissesService } from './caisses.service';

describe('CaissesService', () => {
  let service: CaissesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaissesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
