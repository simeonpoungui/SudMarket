import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquesSoldesFermatureCaissesComponent } from './historiques-soldes-fermature-caisses.component';

describe('HistoriquesSoldesFermatureCaissesComponent', () => {
  let component: HistoriquesSoldesFermatureCaissesComponent;
  let fixture: ComponentFixture<HistoriquesSoldesFermatureCaissesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriquesSoldesFermatureCaissesComponent]
    });
    fixture = TestBed.createComponent(HistoriquesSoldesFermatureCaissesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
