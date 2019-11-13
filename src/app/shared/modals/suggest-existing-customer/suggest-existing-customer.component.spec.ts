import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestExistingCustomerComponent } from './suggest-existing-customer.component';

describe('SuggestExistingCustomerComponent', () => {
  let component: SuggestExistingCustomerComponent;
  let fixture: ComponentFixture<SuggestExistingCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestExistingCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestExistingCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
