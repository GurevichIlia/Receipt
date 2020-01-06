import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterBuilderComponent } from './newsletter-builder.component';

describe('NewsletterBuilderComponent', () => {
  let component: NewsletterBuilderComponent;
  let fixture: ComponentFixture<NewsletterBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsletterBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
