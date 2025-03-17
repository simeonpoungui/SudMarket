import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertStockEntrepotPointDeVenteComponent } from './transfert-stock-entrepot-point-de-vente.component';

describe('TransfertStockEntrepotPointDeVenteComponent', () => {
  let component: TransfertStockEntrepotPointDeVenteComponent;
  let fixture: ComponentFixture<TransfertStockEntrepotPointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransfertStockEntrepotPointDeVenteComponent]
    });
    fixture = TestBed.createComponent(TransfertStockEntrepotPointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
