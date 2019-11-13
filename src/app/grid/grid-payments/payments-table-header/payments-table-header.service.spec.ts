import { TestBed } from '@angular/core/testing';

import { PaymentsTableHeaderService } from './payments-table-header.service';

describe('PaymentsTableHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentsTableHeaderService = TestBed.get(PaymentsTableHeaderService);
    expect(service).toBeTruthy();
  });
});
