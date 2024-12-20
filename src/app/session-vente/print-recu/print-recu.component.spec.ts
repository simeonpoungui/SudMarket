import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRecuComponent } from './print-recu.component';

describe('PrintRecuComponent', () => {
  let component: PrintRecuComponent;
  let fixture: ComponentFixture<PrintRecuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintRecuComponent]
    });
    fixture = TestBed.createComponent(PrintRecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
