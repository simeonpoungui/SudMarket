import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEntrepotsComponent } from './stock-entrepots.component';

describe('StockEntrepotsComponent', () => {
  let component: StockEntrepotsComponent;
  let fixture: ComponentFixture<StockEntrepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockEntrepotsComponent]
    });
    fixture = TestBed.createComponent(StockEntrepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
