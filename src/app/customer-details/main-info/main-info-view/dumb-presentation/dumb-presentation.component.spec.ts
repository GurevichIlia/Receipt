import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumbPresentationComponent } from './dumb-presentation.component';

describe('DumbPresentationComponent', () => {
  let component: DumbPresentationComponent;
  let fixture: ComponentFixture<DumbPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumbPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumbPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
