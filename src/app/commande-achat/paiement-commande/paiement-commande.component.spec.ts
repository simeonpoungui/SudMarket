import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCommandeComponent } from './paiement-commande.component';

describe('PaiementCommandeComponent', () => {
  let component: PaiementCommandeComponent;
  let fixture: ComponentFixture<PaiementCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementCommandeComponent]
    });
    fixture = TestBed.createComponent(PaiementCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
