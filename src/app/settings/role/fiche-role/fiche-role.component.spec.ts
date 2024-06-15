import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheRoleComponent } from './fiche-role.component';

describe('FicheRoleComponent', () => {
  let component: FicheRoleComponent;
  let fixture: ComponentFixture<FicheRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FicheRoleComponent]
    });
    fixture = TestBed.createComponent(FicheRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
