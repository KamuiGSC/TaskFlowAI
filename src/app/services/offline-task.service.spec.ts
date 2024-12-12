import { TestBed } from '@angular/core/testing';

import { OfflineTaskService } from './offline-task.service';

describe('OfflineTaskService', () => {
  let service: OfflineTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
