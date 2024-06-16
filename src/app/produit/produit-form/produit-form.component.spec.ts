import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFormComponent } from './produit-form.component';

describe('ProduitFormComponent', () => {
  let component: ProduitFormComponent;
  let fixture: ComponentFixture<ProduitFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitFormComponent]
    });
    fixture = TestBed.createComponent(ProduitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
