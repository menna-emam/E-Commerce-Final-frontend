import { TestBed } from '@angular/core/testing';
import { AdminTestimonialService } from './admin-testimonial.service';

describe('AdminTestimonialService', () => {
  let service: AdminTestimonialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTestimonialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
