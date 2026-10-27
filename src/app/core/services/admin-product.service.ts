import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IAdminProductsRes } from '../models/admin-product.model';

@Service()
export class AdminProductService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'product';
  getAllProducts() {
    return this._http.get<IAdminProductsRes>(this._apiURL + '/admin/all');
  }
  addProduct(formData: FormData) {
    return this._http.post(this._apiURL, formData);
  }
  updateProduct(productId: string, formData: FormData) {
    return this._http.patch(this._apiURL + '/' + productId, formData);
  }
  setActive(productId: string, isActive: boolean) {
    return this._http.patch(this._apiURL + '/' + productId, { isActive });
  }
  deleteProduct(productId: string) {
    return this._http.delete(this._apiURL + '/' + productId);
  }
}