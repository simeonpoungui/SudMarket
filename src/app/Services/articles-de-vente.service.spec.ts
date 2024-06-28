import { TestBed } from '@angular/core/testing';

import { ArticlesDeVenteService } from './articles-de-vente.service';

describe('ArticlesDeVenteService', () => {
  let service: ArticlesDeVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesDeVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
