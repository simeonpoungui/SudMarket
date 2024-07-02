import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePointDeVenteFormComponent } from './fiche-point-de-vente-form.component';

describe('FichePointDeVenteFormComponent', () => {
  let component: FichePointDeVenteFormComponent;
  let fixture: ComponentFixture<FichePointDeVenteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichePointDeVenteFormComponent]
    });
    fixture = TestBed.createComponent(FichePointDeVenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
