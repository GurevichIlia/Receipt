import { TestBed } from '@angular/core/testing';

import { ServerErrorInterceptor } from './server-error-interceptor.service';

describe('ServerErrorInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerErrorInterceptor = TestBed.get(ServerErrorInterceptor);
    expect(service).toBeTruthy();
  });
});
