import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheArticleDeCommandeComponent } from './fiche-article-de-commande.component';

describe('FicheArticleDeCommandeComponent', () => {
  let component: FicheArticleDeCommandeComponent;
  let fixture: ComponentFixture<FicheArticleDeCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FicheArticleDeCommandeComponent]
    });
    fixture = TestBed.createComponent(FicheArticleDeCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
