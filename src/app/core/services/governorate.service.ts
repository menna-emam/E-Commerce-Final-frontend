import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IGovernorateRes } from '../models/governorate.model';

@Service()
export class GovernorateService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'governorate';

  getGovernorates() {
    return this._http.get<IGovernorateRes>(this._apiURL);
  }
}