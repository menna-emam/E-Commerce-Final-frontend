import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enveronment } from '../../../environments/env';
import { IAddressData, IProfileRes } from '../models/user.model';

@Service()
export class UserService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'user';
  getMyProfile() {
    return this._http.get<IProfileRes>(this._apiURL + '/me');
  }
  addAddress(data: IAddressData) {
    return this._http.post(this._apiURL + '/me/addresses', data);
  }
  updateAddress(addressId: string, data: Partial<IAddressData>) {
    return this._http.patch(this._apiURL + '/me/addresses/' + addressId, data);
  }
  deleteAddress(addressId: string) {
    return this._http.delete(this._apiURL + '/me/addresses/' + addressId);
  }
}