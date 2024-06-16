import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurFicheComponent } from './fournisseur-fiche.component';

describe('FournisseurFicheComponent', () => {
  let component: FournisseurFicheComponent;
  let fixture: ComponentFixture<FournisseurFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FournisseurFicheComponent]
    });
    fixture = TestBed.createComponent(FournisseurFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
