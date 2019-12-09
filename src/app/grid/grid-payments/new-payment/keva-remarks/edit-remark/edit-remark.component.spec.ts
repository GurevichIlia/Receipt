import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRemarkComponent } from './edit-remark.component';

describe('EditRemarkComponent', () => {
  let component: EditRemarkComponent;
  let fixture: ComponentFixture<EditRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
