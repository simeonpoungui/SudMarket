import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaissePrincipaleComponent } from './caisse-principale.component';

describe('CaissePrincipaleComponent', () => {
  let component: CaissePrincipaleComponent;
  let fixture: ComponentFixture<CaissePrincipaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaissePrincipaleComponent]
    });
    fixture = TestBed.createComponent(CaissePrincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
