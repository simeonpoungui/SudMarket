import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFicheComponent } from './produit-fiche.component';

describe('ProduitFicheComponent', () => {
  let component: ProduitFicheComponent;
  let fixture: ComponentFixture<ProduitFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitFicheComponent]
    });
    fixture = TestBed.createComponent(ProduitFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
