import { TestBed } from '@angular/core/testing';

import { FBAuthService } from './auth.service';

describe('FBAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FBAuthService = TestBed.get(FBAuthService);
    expect(service).toBeTruthy();
  });
});
