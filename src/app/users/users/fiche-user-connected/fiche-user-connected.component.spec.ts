import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheUserConnectedComponent } from './fiche-user-connected.component';

describe('FicheUserConnectedComponent', () => {
  let component: FicheUserConnectedComponent;
  let fixture: ComponentFixture<FicheUserConnectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FicheUserConnectedComponent]
    });
    fixture = TestBed.createComponent(FicheUserConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
