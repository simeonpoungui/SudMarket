import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationByIdComponent } from './variation-by-id.component';

describe('VariationByIdComponent', () => {
  let component: VariationByIdComponent;
  let fixture: ComponentFixture<VariationByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariationByIdComponent]
    });
    fixture = TestBed.createComponent(VariationByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
