import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepotFicheComponent } from './entrepot-fiche.component';

describe('EntrepotFicheComponent', () => {
  let component: EntrepotFicheComponent;
  let fixture: ComponentFixture<EntrepotFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepotFicheComponent]
    });
    fixture = TestBed.createComponent(EntrepotFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
