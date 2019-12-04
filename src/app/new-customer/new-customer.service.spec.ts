import { TestBed } from '@angular/core/testing';

import { NewCustomerService } from './new-customer.service';

describe('NewCustomerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewCustomerService = TestBed.get(NewCustomerService);
    expect(service).toBeTruthy();
  });
});
