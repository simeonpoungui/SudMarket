import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVariationsComponent } from './select-variations.component';

describe('SelectVariationsComponent', () => {
  let component: SelectVariationsComponent;
  let fixture: ComponentFixture<SelectVariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectVariationsComponent]
    });
    fixture = TestBed.createComponent(SelectVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
