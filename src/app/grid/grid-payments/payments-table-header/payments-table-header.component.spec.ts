import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTableHeaderComponent } from './payments-table-header.component';

describe('PaymentsTableHeaderComponent', () => {
  let component: PaymentsTableHeaderComponent;
  let fixture: ComponentFixture<PaymentsTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsTableHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
