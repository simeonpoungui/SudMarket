import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteFormComponent } from './vente-form.component';

describe('VenteFormComponent', () => {
  let component: VenteFormComponent;
  let fixture: ComponentFixture<VenteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenteFormComponent]
    });
    fixture = TestBed.createComponent(VenteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
