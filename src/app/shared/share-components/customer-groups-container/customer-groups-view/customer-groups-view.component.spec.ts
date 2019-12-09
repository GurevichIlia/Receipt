import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupsViewComponent } from './customer-groups-view.component';

describe('CustomerGroupsViewComponent', () => {
  let component: CustomerGroupsViewComponent;
  let fixture: ComponentFixture<CustomerGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
