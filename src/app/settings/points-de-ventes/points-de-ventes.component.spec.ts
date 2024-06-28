import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsDeVentesComponent } from './points-de-ventes.component';

describe('PointsDeVentesComponent', () => {
  let component: PointsDeVentesComponent;
  let fixture: ComponentFixture<PointsDeVentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointsDeVentesComponent]
    });
    fixture = TestBed.createComponent(PointsDeVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
