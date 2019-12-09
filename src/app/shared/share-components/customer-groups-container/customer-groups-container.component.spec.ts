import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupsContainerComponent } from './customer-groups-container.component';

describe('CustomerGroupsContainerComponent', () => {
  let component: CustomerGroupsContainerComponent;
  let fixture: ComponentFixture<CustomerGroupsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
