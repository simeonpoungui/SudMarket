import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDeVenteVendeursComponent } from './rapport-de-vente-vendeurs.component';

describe('RapportDeVenteVendeursComponent', () => {
  let component: RapportDeVenteVendeursComponent;
  let fixture: ComponentFixture<RapportDeVenteVendeursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RapportDeVenteVendeursComponent]
    });
    fixture = TestBed.createComponent(RapportDeVenteVendeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
