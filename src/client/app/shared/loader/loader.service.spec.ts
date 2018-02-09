/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing';
import { LoaderService } from './loaders.service';

describe('LoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService]
    });
  });

  it('should ...', inject([LoaderService], (service: LoaderService) => {
    expect(service).toBeTruthy();
  }));
});
