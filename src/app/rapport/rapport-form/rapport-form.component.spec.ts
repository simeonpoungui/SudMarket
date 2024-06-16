import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFormComponent } from './rapport-form.component';

describe('RapportFormComponent', () => {
  let component: RapportFormComponent;
  let fixture: ComponentFixture<RapportFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RapportFormComponent]
    });
    fixture = TestBed.createComponent(RapportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
