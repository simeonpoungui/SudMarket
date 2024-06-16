import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteFicheComponent } from './vente-fiche.component';

describe('VenteFicheComponent', () => {
  let component: VenteFicheComponent;
  let fixture: ComponentFixture<VenteFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenteFicheComponent]
    });
    fixture = TestBed.createComponent(VenteFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
