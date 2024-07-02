import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCommandesAchatsComponent } from './articles-commandes-achats.component';

describe('ArticlesCommandesAchatsComponent', () => {
  let component: ArticlesCommandesAchatsComponent;
  let fixture: ComponentFixture<ArticlesCommandesAchatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesCommandesAchatsComponent]
    });
    fixture = TestBed.createComponent(ArticlesCommandesAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
