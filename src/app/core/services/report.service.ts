import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { ISalesReportRes } from '../models/report.model';
export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
}
@Service()
export class ReportService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'report';
  getSalesReport(filters: ReportFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this._http.get<ISalesReportRes>(this._apiURL + '/sales', { params });
  }
}