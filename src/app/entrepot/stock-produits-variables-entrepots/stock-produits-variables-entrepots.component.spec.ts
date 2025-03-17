import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProduitsVariablesEntrepotsComponent } from './stock-produits-variables-entrepots.component';

describe('StockProduitsVariablesEntrepotsComponent', () => {
  let component: StockProduitsVariablesEntrepotsComponent;
  let fixture: ComponentFixture<StockProduitsVariablesEntrepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockProduitsVariablesEntrepotsComponent]
    });
    fixture = TestBed.createComponent(StockProduitsVariablesEntrepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
