import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPointDeVenteComponent } from './select-point-de-vente.component';

describe('SelectPointDeVenteComponent', () => {
  let component: SelectPointDeVenteComponent;
  let fixture: ComponentFixture<SelectPointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPointDeVenteComponent]
    });
    fixture = TestBed.createComponent(SelectPointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
