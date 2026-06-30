import { TestBed } from '@angular/core/testing';

import { MockProductService } from './mock-product-service';

describe('MockProductService', () => {
  let service: MockProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
