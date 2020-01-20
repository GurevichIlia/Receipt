import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterAftersendComponent } from './newsletter-aftersend.component';

describe('NewsletterAftersendComponent', () => {
  let component: NewsletterAftersendComponent;
  let fixture: ComponentFixture<NewsletterAftersendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsletterAftersendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterAftersendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
