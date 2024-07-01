import { TestBed } from '@angular/core/testing';

import { ArticlesCommandesAchatsService } from './articles-commandes-achats.service';

describe('ArticlesCommandesAchatsService', () => {
  let service: ArticlesCommandesAchatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesCommandesAchatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
