import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskTokenComponent } from './ask-token.component';

describe('AskTokenComponent', () => {
  let component: AskTokenComponent;
  let fixture: ComponentFixture<AskTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AskTokenComponent]
    });
    fixture = TestBed.createComponent(AskTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
