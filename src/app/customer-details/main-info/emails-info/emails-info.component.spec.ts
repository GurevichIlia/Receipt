import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsInfoComponent } from './emails-info.component';

describe('EmailsInfoComponent', () => {
  let component: EmailsInfoComponent;
  let fixture: ComponentFixture<EmailsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
