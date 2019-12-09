import { TestBed } from '@angular/core/testing';

import { CustomerGroupsService } from './customer-groups.service';

describe('CustomerGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerGroupsService = TestBed.get(CustomerGroupsService);
    expect(service).toBeTruthy();
  });
});
