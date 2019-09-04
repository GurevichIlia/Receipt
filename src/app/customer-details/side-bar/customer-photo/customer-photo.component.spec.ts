import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPhotoComponent } from './customer-photo.component';

describe('CustomerPhotoComponent', () => {
  let component: CustomerPhotoComponent;
  let fixture: ComponentFixture<CustomerPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
