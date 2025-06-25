import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousCategorieDepensesComponent } from './sous-categorie-depenses.component';

describe('SousCategorieDepensesComponent', () => {
  let component: SousCategorieDepensesComponent;
  let fixture: ComponentFixture<SousCategorieDepensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SousCategorieDepensesComponent]
    });
    fixture = TestBed.createComponent(SousCategorieDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
