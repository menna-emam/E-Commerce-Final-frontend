import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IAddTestimonialRes, ITestimonialsRes } from '../models/testimonial.model';

@Service()
export class TestimonialService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'testimonial';
  getApproved(limit = 6) {
    return this._http.get<ITestimonialsRes>(this._apiURL, { params: { limit } });
  }
  add(message: string) {
    return this._http.post<IAddTestimonialRes>(this._apiURL, { message });
  }
}