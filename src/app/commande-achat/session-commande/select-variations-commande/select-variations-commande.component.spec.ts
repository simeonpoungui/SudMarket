import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVariationsCommandeComponent } from './select-variations-commande.component';

describe('SelectVariationsCommandeComponent', () => {
  let component: SelectVariationsCommandeComponent;
  let fixture: ComponentFixture<SelectVariationsCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectVariationsCommandeComponent]
    });
    fixture = TestBed.createComponent(SelectVariationsCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
