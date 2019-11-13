import { TestBed } from '@angular/core/testing';

import { GlobalMethodsService } from './global-methods.service';

describe('GlobalMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalMethodsService = TestBed.get(GlobalMethodsService);
    expect(service).toBeTruthy();
  });
});
