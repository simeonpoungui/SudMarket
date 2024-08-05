import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotureJourneeComponent } from './cloture-journee.component';

describe('ClotureJourneeComponent', () => {
  let component: ClotureJourneeComponent;
  let fixture: ComponentFixture<ClotureJourneeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClotureJourneeComponent]
    });
    fixture = TestBed.createComponent(ClotureJourneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
