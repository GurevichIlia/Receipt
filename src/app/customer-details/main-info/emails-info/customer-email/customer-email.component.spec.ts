import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEmailComponent } from './customer-email.component';

describe('CustomerEmailComponent', () => {
  let component: CustomerEmailComponent;
  let fixture: ComponentFixture<CustomerEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
