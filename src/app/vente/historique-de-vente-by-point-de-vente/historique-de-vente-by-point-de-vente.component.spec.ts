import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDeVenteByPointDeVenteComponent } from './historique-de-vente-by-point-de-vente.component';

describe('HistoriqueDeVenteByPointDeVenteComponent', () => {
  let component: HistoriqueDeVenteByPointDeVenteComponent;
  let fixture: ComponentFixture<HistoriqueDeVenteByPointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueDeVenteByPointDeVenteComponent]
    });
    fixture = TestBed.createComponent(HistoriqueDeVenteByPointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
