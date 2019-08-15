import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTableViewComponent } from './payments-table-view.component';

describe('PaymentsTableViewComponent', () => {
  let component: PaymentsTableViewComponent;
  let fixture: ComponentFixture<PaymentsTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
