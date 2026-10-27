import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CategoriesResponse } from '../models/category.model';
import { enveronment } from '../../../environments/env';                   

@Service()
export class CategoryService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'category';                       
  getCategories() {
    return this._http.get<CategoriesResponse>(this._apiURL);
  }
  getSubCategories(categoryId: string) {
    return this._http.get<CategoriesResponse>(`${this._apiURL}/sub`, {
      params: { category: categoryId },
    });
  }
}