import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IAdminTestimonialsRes } from '../models/admin-testimonial.model';

export interface TestimonialFilters {
  status?: string;
  page?: number;
  limit?: number;
}

@Service()
export class AdminTestimonialService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'testimonial/admin';
  getAll(filters: TestimonialFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this._http.get<IAdminTestimonialsRes>(this._apiURL + '/all', { params });
  }
  updateStatus(id: string, status: string) {
    return this._http.patch(this._apiURL + '/' + id + '/status', { status });
  }
}