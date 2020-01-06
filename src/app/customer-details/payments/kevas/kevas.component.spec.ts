import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KevasComponent } from './kevas.component';

describe('KevasComponent', () => {
  let component: KevasComponent;
  let fixture: ComponentFixture<KevasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KevasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KevasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
