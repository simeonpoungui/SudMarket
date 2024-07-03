import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFournisseurComponent } from './select-fournisseur.component';

describe('SelectFournisseurComponent', () => {
  let component: SelectFournisseurComponent;
  let fixture: ComponentFixture<SelectFournisseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectFournisseurComponent]
    });
    fixture = TestBed.createComponent(SelectFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
