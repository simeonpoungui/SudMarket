import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionVenteComponent } from './session-vente.component';

describe('SessionVenteComponent', () => {
  let component: SessionVenteComponent;
  let fixture: ComponentFixture<SessionVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionVenteComponent]
    });
    fixture = TestBed.createComponent(SessionVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
