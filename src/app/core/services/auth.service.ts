import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { enveronment } from '../../../environments/env';
import { ILoginData, ILoginRes, IRegisterData, IToken } from '../models/auth.model';

@Service()
export class AuthService {
  private _http = inject(HttpClient);
  private _apiURL = enveronment.apiURL + 'auth';
  private _router = inject(Router);
  private userData = new BehaviorSubject<IToken | null>(null);
  getUserData() {
    return this.userData.asObservable();
  }
  checkIfLogedin() {
    const token = this.getToken();
    if (token){
      const decode = this.decodeToken(token);
      if (decode?.exp) {
        const expiryDate = decode.exp * 1000;
        if (Date.now() < expiryDate) {
          return this.userData.next(decode);
        }
      }
    }
    this.logOut();
  }
  ifLogedinWithRole(role: string) {
    const token = this.getToken();
    if (token){
      const decode = this.decodeToken(token);
      if (decode?.exp) {
        const expiryDate = decode.exp * 1000;
        if (Date.now() < expiryDate) {
          if (decode.role == role) {
            return true;
          }
        }
      }
    }
    return false;
  }
  logOut() {
    this.deleteToken();
    this.userData.next(null);
  }
  register(data: IRegisterData) {
    return this._http.post<{ message: string }>(enveronment.apiURL + 'user', data);
  }
  login(data: ILoginData, returnUrl = '/') {
    return this._http.post<ILoginRes>(this._apiURL + '/login', data).pipe(
      tap((res) => {
        if (res.data) {
          const myUserInfo = this.decodeToken(res.data);
          if (myUserInfo) {
            this.saveToken(res.data);
            this.userData.next(myUserInfo);
            if (myUserInfo.role === 'admin') {
              this._router.navigate(['/dashboard']);
            } else {
              this._router.navigateByUrl(returnUrl);
            }
          }
        }
      }),
    );
  }
  private tokenKey = 'token';
  private saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  private deleteToken() {
    localStorage.removeItem(this.tokenKey);
  }
  decodeToken(token: string): IToken | null {
    try {
      return jwtDecode<IToken>(token);
    } catch (err) {
      return null;
    }
  }
}