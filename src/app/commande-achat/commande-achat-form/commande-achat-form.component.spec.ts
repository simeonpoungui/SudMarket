import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAChatFormComponent } from './commande-achat-form.component';

describe('CommandeAChatFormComponent', () => {
  let component: CommandeAChatFormComponent;
  let fixture: ComponentFixture<CommandeAChatFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAChatFormComponent]
    });
    fixture = TestBed.createComponent(CommandeAChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
