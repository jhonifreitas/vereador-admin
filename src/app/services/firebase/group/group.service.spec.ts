import { TestBed } from '@angular/core/testing';

import { FBAdminService } from './admin.service';

describe('FBAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FBAdminService = TestBed.get(FBAdminService);
    expect(service).toBeTruthy();
  });
});
