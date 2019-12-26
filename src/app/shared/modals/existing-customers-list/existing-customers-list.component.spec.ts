import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCustomersListComponent } from './existing-customers-list.component';

describe('ExistingCustomersListComponent', () => {
  let component: ExistingCustomersListComponent;
  let fixture: ComponentFixture<ExistingCustomersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingCustomersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingCustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
