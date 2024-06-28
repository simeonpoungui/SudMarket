import { TestBed } from '@angular/core/testing';

import { PointsDeVentesService } from './points-de-ventes.service';

describe('PointsDeVentesService', () => {
  let service: PointsDeVentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsDeVentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
