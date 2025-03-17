import { TestBed } from '@angular/core/testing';

import { EntrepotService } from './entrepot.service';

describe('EntrepotService', () => {
  let service: EntrepotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntrepotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
