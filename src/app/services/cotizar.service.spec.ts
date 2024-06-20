import { TestBed } from '@angular/core/testing';

import { CotizarService } from './cotizar.service';

describe('CotizarService', () => {
  let service: CotizarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
