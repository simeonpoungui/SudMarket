import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueFicheComponent } from './boutique-fiche.component';

describe('BoutiqueFicheComponent', () => {
  let component: BoutiqueFicheComponent;
  let fixture: ComponentFixture<BoutiqueFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoutiqueFicheComponent]
    });
    fixture = TestBed.createComponent(BoutiqueFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
