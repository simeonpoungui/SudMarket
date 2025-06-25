import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieDepensesComponent } from './categorie-depenses.component';

describe('CategorieDepensesComponent', () => {
  let component: CategorieDepensesComponent;
  let fixture: ComponentFixture<CategorieDepensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieDepensesComponent]
    });
    fixture = TestBed.createComponent(CategorieDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
