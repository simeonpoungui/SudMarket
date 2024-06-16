import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFicheComponent } from './rapport-fiche.component';

describe('RapportFicheComponent', () => {
  let component: RapportFicheComponent;
  let fixture: ComponentFixture<RapportFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RapportFicheComponent]
    });
    fixture = TestBed.createComponent(RapportFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
