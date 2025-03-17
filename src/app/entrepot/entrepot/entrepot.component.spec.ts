import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepotComponent } from './entrepot.component';

describe('EntrepotComponent', () => {
  let component: EntrepotComponent;
  let fixture: ComponentFixture<EntrepotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepotComponent]
    });
    fixture = TestBed.createComponent(EntrepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
