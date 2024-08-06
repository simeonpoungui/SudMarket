import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteJournaliereByUserComponent } from './vente-journaliere-by-user.component';

describe('VenteJournaliereByUserComponent', () => {
  let component: VenteJournaliereByUserComponent;
  let fixture: ComponentFixture<VenteJournaliereByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenteJournaliereByUserComponent]
    });
    fixture = TestBed.createComponent(VenteJournaliereByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
