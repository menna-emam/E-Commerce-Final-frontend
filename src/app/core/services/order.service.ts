import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IOrderRes, IOrdersRes } from '../models/order.model';

@Service()
export class OrderService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'order';
  createOrder(addressId: string) {
    return this._http.post<IOrderRes>(this._apiURL, { addressId });
  }
  getMyOrders(page = 1) {
    return this._http.get<IOrdersRes>(this._apiURL, { params: { page, limit: 10 } });
  }
  cancelOrder(orderId: string) {
    return this._http.patch<IOrderRes>(`${this._apiURL}/${orderId}/cancel`, {});
  }
}