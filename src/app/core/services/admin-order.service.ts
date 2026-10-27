import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IAdminOrdersRes } from '../models/admin-order.model';

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}
@Service()
export class AdminOrderService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'order/admin';
  getAllOrders(filters: OrderFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this._http.get<IAdminOrdersRes>(this._apiURL + '/all', { params });
  }
  updateStatus(orderId: string, status: string) {
    return this._http.patch(this._apiURL + '/' + orderId + '/status', { status });
  }
}