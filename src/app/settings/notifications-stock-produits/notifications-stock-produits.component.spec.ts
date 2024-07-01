import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsStockProduitsComponent } from './notifications-stock-produits.component';

describe('NotificationsStockProduitsComponent', () => {
  let component: NotificationsStockProduitsComponent;
  let fixture: ComponentFixture<NotificationsStockProduitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsStockProduitsComponent]
    });
    fixture = TestBed.createComponent(NotificationsStockProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
