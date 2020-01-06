import { TestBed } from '@angular/core/testing';

import { DialogFactoryService } from './dialog-factory.service';

describe('DialogFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogFactoryService = TestBed.get(DialogFactoryService);
    expect(service).toBeTruthy();
  });
});
