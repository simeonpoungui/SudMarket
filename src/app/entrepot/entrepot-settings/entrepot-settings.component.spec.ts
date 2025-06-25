import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepotSettingsComponent } from './entrepot-settings.component';

describe('EntrepotSettingsComponent', () => {
  let component: EntrepotSettingsComponent;
  let fixture: ComponentFixture<EntrepotSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepotSettingsComponent]
    });
    fixture = TestBed.createComponent(EntrepotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
