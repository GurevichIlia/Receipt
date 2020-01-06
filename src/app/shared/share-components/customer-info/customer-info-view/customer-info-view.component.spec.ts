import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInfoViewComponent } from './customer-info-view.component';

describe('CustomerInfoViewComponent', () => {
  let component: CustomerInfoViewComponent;
  let fixture: ComponentFixture<CustomerInfoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInfoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
