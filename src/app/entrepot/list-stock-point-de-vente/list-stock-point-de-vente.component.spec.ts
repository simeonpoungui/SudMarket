import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockPointDeVenteComponent } from './list-stock-point-de-vente.component';

describe('ListStockPointDeVenteComponent', () => {
  let component: ListStockPointDeVenteComponent;
  let fixture: ComponentFixture<ListStockPointDeVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListStockPointDeVenteComponent]
    });
    fixture = TestBed.createComponent(ListStockPointDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
