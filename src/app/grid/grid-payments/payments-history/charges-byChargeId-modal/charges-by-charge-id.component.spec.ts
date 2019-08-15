import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesByChargeIdComponent } from './charges-by-charge-id.component';

describe('ChargesByChargeIdComponent', () => {
  let component: ChargesByChargeIdComponent;
  let fixture: ComponentFixture<ChargesByChargeIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesByChargeIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesByChargeIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
