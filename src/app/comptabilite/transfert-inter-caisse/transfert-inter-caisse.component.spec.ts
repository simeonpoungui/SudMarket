import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertInterCaisseComponent } from './transfert-inter-caisse.component';

describe('TransfertInterCaisseComponent', () => {
  let component: TransfertInterCaisseComponent;
  let fixture: ComponentFixture<TransfertInterCaisseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransfertInterCaisseComponent]
    });
    fixture = TestBed.createComponent(TransfertInterCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
