import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePayementComponent } from './validate-payement.component';

describe('ValidatePayementComponent', () => {
  let component: ValidatePayementComponent;
  let fixture: ComponentFixture<ValidatePayementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatePayementComponent]
    });
    fixture = TestBed.createComponent(ValidatePayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
