import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProccessRecieptComponent } from './proccess-reciept.component';

describe('ProccessRecieptComponent', () => {
  let component: ProccessRecieptComponent;
  let fixture: ComponentFixture<ProccessRecieptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProccessRecieptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProccessRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
