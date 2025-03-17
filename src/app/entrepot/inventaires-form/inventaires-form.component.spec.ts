import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventairesFormComponent } from './inventaires-form.component';

describe('InventairesFormComponent', () => {
  let component: InventairesFormComponent;
  let fixture: ComponentFixture<InventairesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventairesFormComponent]
    });
    fixture = TestBed.createComponent(InventairesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
