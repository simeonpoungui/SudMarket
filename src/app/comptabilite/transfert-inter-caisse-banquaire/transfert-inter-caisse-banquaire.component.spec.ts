import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertInterCaisseBanquaireComponent } from './transfert-inter-caisse-banquaire.component';

describe('TransfertInterCaisseBanquaireComponent', () => {
  let component: TransfertInterCaisseBanquaireComponent;
  let fixture: ComponentFixture<TransfertInterCaisseBanquaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransfertInterCaisseBanquaireComponent]
    });
    fixture = TestBed.createComponent(TransfertInterCaisseBanquaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
