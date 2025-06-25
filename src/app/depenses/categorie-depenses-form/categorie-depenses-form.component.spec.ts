import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieDepensesFormComponent } from './categorie-depenses-form.component';

describe('CategorieDepensesFormComponent', () => {
  let component: CategorieDepensesFormComponent;
  let fixture: ComponentFixture<CategorieDepensesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieDepensesFormComponent]
    });
    fixture = TestBed.createComponent(CategorieDepensesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
