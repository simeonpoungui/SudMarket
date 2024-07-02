import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCommandeComponent } from './session-commande.component';

describe('SessionCommandeComponent', () => {
  let component: SessionCommandeComponent;
  let fixture: ComponentFixture<SessionCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionCommandeComponent]
    });
    fixture = TestBed.createComponent(SessionCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
