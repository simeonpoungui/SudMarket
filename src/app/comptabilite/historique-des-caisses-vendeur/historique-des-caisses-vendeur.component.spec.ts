import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDesCaissesVendeurComponent } from './historique-des-caisses-vendeur.component';

describe('HistoriqueDesCaissesVendeurComponent', () => {
  let component: HistoriqueDesCaissesVendeurComponent;
  let fixture: ComponentFixture<HistoriqueDesCaissesVendeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueDesCaissesVendeurComponent]
    });
    fixture = TestBed.createComponent(HistoriqueDesCaissesVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
