import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KevaRemarksComponent } from './keva-remarks.component';

describe('KevaRemarksComponent', () => {
  let component: KevaRemarksComponent;
  let fixture: ComponentFixture<KevaRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KevaRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KevaRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
