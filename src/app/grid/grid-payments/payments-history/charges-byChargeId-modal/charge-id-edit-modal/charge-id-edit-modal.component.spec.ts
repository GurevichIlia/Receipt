import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeIdEditModalComponent } from './charge-id-edit-modal.component';

describe('ChargeIdEditModalComponent', () => {
  let component: ChargeIdEditModalComponent;
  let fixture: ComponentFixture<ChargeIdEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeIdEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeIdEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
