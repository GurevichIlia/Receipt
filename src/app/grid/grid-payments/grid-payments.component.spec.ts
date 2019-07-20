import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPaymentsComponent } from './grid-payments.component';

describe('GridPaymentsComponent', () => {
  let component: GridPaymentsComponent;
  let fixture: ComponentFixture<GridPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
