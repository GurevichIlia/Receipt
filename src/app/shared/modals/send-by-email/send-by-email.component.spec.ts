import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendByEmailComponent } from './send-by-email.component';

describe('SendByEmailComponent', () => {
  let component: SendByEmailComponent;
  let fixture: ComponentFixture<SendByEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendByEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
