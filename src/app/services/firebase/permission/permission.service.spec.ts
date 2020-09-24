import { TestBed } from '@angular/core/testing';

import { FBPermissionService } from './permission.service';

describe('FBPermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FBPermissionService = TestBed.get(FBPermissionService);
    expect(service).toBeTruthy();
  });
});
