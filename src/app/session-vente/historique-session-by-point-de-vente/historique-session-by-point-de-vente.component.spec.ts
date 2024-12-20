import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueSessionByPointDeVenteComponent } from './historique-session-by-point-de-vente.component';

describe('HistoriqueSessionByPointDeVenteComponent', () => {
  let component: HistoriqueSessionByPointDeVenteComponent;
  let fixture: ComponentFixture<HistoriqueSessionByPointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueSessionByPointDeVenteComponent]
    });
    fixture = TestBed.createComponent(HistoriqueSessionByPointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
