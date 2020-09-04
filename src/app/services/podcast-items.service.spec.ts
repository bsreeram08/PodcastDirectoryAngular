import { TestBed } from '@angular/core/testing';

import { PodcastItemsService } from './podcast-items.service';

describe('PodcastItemsService', () => {
  let service: PodcastItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodcastItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
