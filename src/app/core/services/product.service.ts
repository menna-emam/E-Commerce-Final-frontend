import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Product, ProductsResponse } from '../models/product.model';
import { enveronment } from '../../../environments/env';                    

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  season?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
@Service()
export class ProductService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'product';                         
  getProducts(filters: ProductFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this._http.get<ProductsResponse>(this._apiURL, { params });
  }
  getProductBySlug(slug: string) {
    return this._http.get<{ message: string; data: Product }>(`${this._apiURL}/${slug}`);
  }
  getRelatedProducts(slug: string) {
    return this._http.get<{ message: string; data: Product[] }>(
      `${this._apiURL}/related-products/${slug}`,
    );
  }
}