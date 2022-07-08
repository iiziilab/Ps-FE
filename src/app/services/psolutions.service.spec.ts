import { TestBed } from '@angular/core/testing';

import { PsolutionsService } from './psolutions.service';

describe('PsolutionsService', () => {
  let service: PsolutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsolutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
