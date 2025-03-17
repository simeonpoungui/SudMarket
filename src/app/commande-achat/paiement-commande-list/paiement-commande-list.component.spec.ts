import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCommandeListComponent } from './paiement-commande-list.component';

describe('PaiementCommandeListComponent', () => {
  let component: PaiementCommandeListComponent;
  let fixture: ComponentFixture<PaiementCommandeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementCommandeListComponent]
    });
    fixture = TestBed.createComponent(PaiementCommandeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
