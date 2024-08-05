import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseVendeurComponent } from './caisse-vendeur.component';

describe('CaisseVendeurComponent', () => {
  let component: CaisseVendeurComponent;
  let fixture: ComponentFixture<CaisseVendeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaisseVendeurComponent]
    });
    fixture = TestBed.createComponent(CaisseVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
