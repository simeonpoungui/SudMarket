import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheClientComponent } from './fiche-client.component';

describe('FicheClientComponent', () => {
  let component: FicheClientComponent;
  let fixture: ComponentFixture<FicheClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FicheClientComponent]
    });
    fixture = TestBed.createComponent(FicheClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
