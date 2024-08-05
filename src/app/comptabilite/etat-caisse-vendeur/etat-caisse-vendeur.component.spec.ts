import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatCaisseVendeurComponent } from './etat-caisse-vendeur.component';

describe('EtatCaisseVendeurComponent', () => {
  let component: EtatCaisseVendeurComponent;
  let fixture: ComponentFixture<EtatCaisseVendeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtatCaisseVendeurComponent]
    });
    fixture = TestBed.createComponent(EtatCaisseVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
