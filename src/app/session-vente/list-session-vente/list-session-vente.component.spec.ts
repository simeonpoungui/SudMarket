import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSessionVenteComponent } from './list-session-vente.component';

describe('ListSessionVenteComponent', () => {
  let component: ListSessionVenteComponent;
  let fixture: ComponentFixture<ListSessionVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSessionVenteComponent]
    });
    fixture = TestBed.createComponent(ListSessionVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
