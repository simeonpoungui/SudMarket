import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAChatComponent } from './commande-achat.component';

describe('CommandeAChatComponent', () => {
  let component: CommandeAChatComponent;
  let fixture: ComponentFixture<CommandeAChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAChatComponent]
    });
    fixture = TestBed.createComponent(CommandeAChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
