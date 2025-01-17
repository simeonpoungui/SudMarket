import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsCommandesComponent } from './notifications-commandes.component';

describe('NotificationsCommandesComponent', () => {
  let component: NotificationsCommandesComponent;
  let fixture: ComponentFixture<NotificationsCommandesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsCommandesComponent]
    });
    fixture = TestBed.createComponent(NotificationsCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
