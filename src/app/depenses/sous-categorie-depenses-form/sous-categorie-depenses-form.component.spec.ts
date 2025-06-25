import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousCategorieDepensesFormComponent } from './sous-categorie-depenses-form.component';

describe('SousCategorieDepensesFormComponent', () => {
  let component: SousCategorieDepensesFormComponent;
  let fixture: ComponentFixture<SousCategorieDepensesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SousCategorieDepensesFormComponent]
    });
    fixture = TestBed.createComponent(SousCategorieDepensesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
