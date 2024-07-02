import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePointDeVenteComponent } from './fiche-point-de-vente.component';

describe('FichePointDeVenteComponent', () => {
  let component: FichePointDeVenteComponent;
  let fixture: ComponentFixture<FichePointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichePointDeVenteComponent]
    });
    fixture = TestBed.createComponent(FichePointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
