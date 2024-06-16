import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurFormComponent } from './fournisseur-form.component';

describe('FournisseurFormComponent', () => {
  let component: FournisseurFormComponent;
  let fixture: ComponentFixture<FournisseurFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FournisseurFormComponent]
    });
    fixture = TestBed.createComponent(FournisseurFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
