import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDeVentesComponent } from './article-de-ventes.component';

describe('ArticleDeVentesComponent', () => {
  let component: ArticleDeVentesComponent;
  let fixture: ComponentFixture<ArticleDeVentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleDeVentesComponent]
    });
    fixture = TestBed.createComponent(ArticleDeVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
