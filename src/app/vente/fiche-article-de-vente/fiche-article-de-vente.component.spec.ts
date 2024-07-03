import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheArticleDeVenteComponent } from './fiche-article-de-vente.component';

describe('FicheArticleDeVenteComponent', () => {
  let component: FicheArticleDeVenteComponent;
  let fixture: ComponentFixture<FicheArticleDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FicheArticleDeVenteComponent]
    });
    fixture = TestBed.createComponent(FicheArticleDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
