import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from 'src/app/interfaces/auth/login';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }

  authLogin(data: Login) {
    return this._http.post(`${url}/auth/signin`, data);
  }
}
