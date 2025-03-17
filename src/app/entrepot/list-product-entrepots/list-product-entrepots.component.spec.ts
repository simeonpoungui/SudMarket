import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductEntrepotsComponent } from './list-product-entrepots.component';

describe('ListProductEntrepotsComponent', () => {
  let component: ListProductEntrepotsComponent;
  let fixture: ComponentFixture<ListProductEntrepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProductEntrepotsComponent]
    });
    fixture = TestBed.createComponent(ListProductEntrepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
