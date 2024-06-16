import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAChatFicheComponent } from './commande-achat-fiche.component';

describe('CommandeAChatFicheComponent', () => {
  let component: CommandeAChatFicheComponent;
  let fixture: ComponentFixture<CommandeAChatFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAChatFicheComponent]
    });
    fixture = TestBed.createComponent(CommandeAChatFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
