import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsForNewPaymentComponent } from './customer-details-for-new-payment.component';

describe('CustomerDetailsForNewPaymentComponent', () => {
  let component: CustomerDetailsForNewPaymentComponent;
  let fixture: ComponentFixture<CustomerDetailsForNewPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailsForNewPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsForNewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
